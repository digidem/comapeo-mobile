#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: scripts/storybook-capture-all.sh [output-directory]

Capture every Storybook story in the ordered capture manifest.
The default output directory is storybook-captures at the repository root.

Environment:
  STORYBOOK_CAPTURE_MANIFEST  Manifest path (default: .rnstorybook/capture-manifest.tsv)
  STORYBOOK_CAPTURE_COMMAND   Capture command (default: scripts/storybook-capture.sh)
  STORYBOOK_PACKAGE_ID        Passed through to the capture command
  STORYBOOK_READY_TARGET      Set per manifest row for the capture command
  STORYBOOK_SETTLE_DELAY      Post-readiness delay set per manifest row
  STORYBOOK_COLD_START_TIMEOUT Seconds to wait for Running "main" (default: 300)
EOF
}

fail() {
  echo "storybook-capture-all: $*" >&2
  exit 1
}

if [[ $# -gt 1 ]]; then
  usage
  exit 2
fi

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
repo_root=$(cd -- "$script_dir/.." && pwd -P)

manifest_path=${STORYBOOK_CAPTURE_MANIFEST:-.rnstorybook/capture-manifest.tsv}
capture_command=${STORYBOOK_CAPTURE_COMMAND:-scripts/storybook-capture.sh}
output_path=${1:-storybook-captures}
package_id=${STORYBOOK_PACKAGE_ID:-com.comapeo.dev}
cold_start_timeout=${STORYBOOK_COLD_START_TIMEOUT:-300}

if [[ ! $package_id =~ ^[A-Za-z][A-Za-z0-9_.]*$ ]]; then
  fail "STORYBOOK_PACKAGE_ID is invalid: $package_id"
fi
if [[ ! $cold_start_timeout =~ ^[1-9][0-9]*$ ]]; then
  fail "STORYBOOK_COLD_START_TIMEOUT must be a positive integer"
fi

if [[ $manifest_path != /* ]]; then
  manifest_path="$repo_root/$manifest_path"
fi
if [[ $capture_command != /* ]]; then
  capture_command="$repo_root/$capture_command"
fi
if [[ $output_path != /* ]]; then
  output_path="$repo_root/$output_path"
fi

[[ -f $manifest_path ]] || fail "manifest does not exist: $manifest_path"
[[ -r $manifest_path ]] || fail "manifest is not readable: $manifest_path"
[[ -x $capture_command ]] || fail "capture command is not executable: $capture_command"

if [[ -e $output_path && ! -d $output_path ]]; then
  fail "output path exists and is not a directory: $output_path"
fi
if [[ -d $output_path ]] && find "$output_path" -mindepth 1 -maxdepth 1 -print -quit | grep -q .; then
  fail "output directory is not empty: $output_path"
fi

declare -a flows=()
declare -a story_ids=()
declare -a ready_targets=()
declare -a settle_delays=()
declare -a labels=()
declare -A seen_story_ids=()

line_number=0
while IFS= read -r line || [[ -n $line ]]; do
  ((line_number += 1))

  if [[ $line =~ ^[[:space:]]*$ || $line =~ ^[[:space:]]*# ]]; then
    continue
  fi

  line_without_tabs=${line//$'\t'/}
  tab_count=$(( ${#line} - ${#line_without_tabs} ))
  if (( tab_count != 4 )); then
    fail "manifest line $line_number must contain exactly five tab-separated columns"
  fi

  flow=${line%%$'\t'*}
  remainder=${line#*$'\t'}
  story_id=${remainder%%$'\t'*}
  remainder=${remainder#*$'\t'}
  ready_target=${remainder%%$'\t'*}
  remainder=${remainder#*$'\t'}
  settle_delay=${remainder%%$'\t'*}
  label=${remainder#*$'\t'}

  if [[ ! $flow =~ ^[a-z0-9-]+$ ]]; then
    fail "manifest line $line_number has an invalid flow: $flow"
  fi
  if [[ -z $story_id ]]; then
    fail "manifest line $line_number has an empty story id"
  fi
  if [[ -v "seen_story_ids[$story_id]" ]]; then
    fail "manifest line $line_number repeats story id: $story_id"
  fi
  if [[ ! $ready_target =~ ^(route:[A-Za-z][A-Za-z0-9]*|testID:[A-Za-z0-9][A-Za-z0-9._:-]*)$ ]]; then
    fail "manifest line $line_number has an invalid readiness target: $ready_target"
  fi
  if [[ ! $settle_delay =~ ^[0-9]+([.][0-9]+)?$ ]]; then
    fail "manifest line $line_number has an invalid settle delay: $settle_delay"
  fi

  seen_story_ids["$story_id"]=1
  flows+=("$flow")
  story_ids+=("$story_id")
  ready_targets+=("$ready_target")
  settle_delays+=("$settle_delay")
  labels+=("$label")
done <"$manifest_path"

cd -- "$repo_root"
node - "$repo_root/.rnstorybook" "${story_ids[@]}" <<'NODE'
const {buildIndex} = require('@storybook/react-native/node');

const configPath = process.argv[2];
const requestedIds = process.argv.slice(3);

buildIndex({configPath})
  .then((index) => {
    const missingIds = requestedIds.filter((id) => !(id in index.entries));
    if (missingIds.length > 0) {
      console.error(
        `storybook-capture-all: manifest stories missing from source index: ${missingIds.join(', ')}`,
      );
      process.exitCode = 1;
    }
  })
  .catch((error) => {
    console.error(`storybook-capture-all: failed to build source index: ${error.message}`);
    process.exitCode = 1;
  });
NODE

command -v adb >/dev/null 2>&1 || {
  echo "storybook-capture-all: adb was not found; install/configure the Android SDK platform-tools" >&2
  exit 127
}

mkdir -p -- "$output_path"
provenance_path="$output_path/cold-start-provenance.txt"

printf '%s\n' \
  'Storybook full-manifest cold-start provenance' \
  "started_utc=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  "package_id=$package_id" \
  "force_stop_command=adb shell am force-stop $package_id" \
  "log_clear_command=adb logcat -c" \
  "launcher_command=adb shell am start -n $package_id/.MainActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER" \
  >"$provenance_path"

adb wait-for-device

if ! force_stop_output=$(adb shell am force-stop "$package_id" 2>&1); then
  printf 'force_stop_status=failed\n%s\n' "$force_stop_output" >>"$provenance_path"
  fail "could not force-stop Storybook; see $provenance_path"
fi
printf 'force_stop_status=passed\n%s\n' "$force_stop_output" >>"$provenance_path"

if ! log_clear_output=$(adb logcat -c 2>&1); then
  printf 'log_clear_status=failed\n%s\n' "$log_clear_output" >>"$provenance_path"
  fail "could not clear Android logs; see $provenance_path"
fi
printf 'log_clear_status=passed\n%s\n' "$log_clear_output" >>"$provenance_path"

if ! launcher_output=$(
  adb shell am start \
    -n "$package_id/.MainActivity" \
    -a android.intent.action.MAIN \
    -c android.intent.category.LAUNCHER 2>&1
); then
  printf 'launcher_status=failed\n%s\n' "$launcher_output" >>"$provenance_path"
  fail "could not cold-start Storybook; see $provenance_path"
fi
printf 'launcher_status=passed\n--- launcher output ---\n%s\n' "$launcher_output" >>"$provenance_path"

startup_deadline=$((SECONDS + cold_start_timeout))
running_main_evidence=
startup_logs=
while (( SECONDS < startup_deadline )); do
  if startup_logs=$(adb logcat -d -v raw -s ReactNativeJS:I '*:S') &&
    running_main_evidence=$(grep -F 'Running "main"' <<<"$startup_logs" | tail -n 1) &&
    [[ -n $running_main_evidence ]]; then
    break
  fi
  sleep 0.5
done

if [[ -z $running_main_evidence ]]; then
  printf 'running_main_status=failed\n--- startup ReactNativeJS log snapshot ---\n%s\n' \
    "$startup_logs" >>"$provenance_path"
  fail "timed out waiting for Running \"main\"; see $provenance_path"
fi

printf '%s\n' \
  'running_main_status=passed' \
  "running_main_evidence=$running_main_evidence" \
  'no_hmr_basis=force-stop and launcher cold start reached Running "main" before deep-link story selection' \
  '--- startup ReactNativeJS log snapshot ---' \
  "$startup_logs" \
  "ready_utc=$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  >>"$provenance_path"

ledger_path="$output_path/captures.tsv"
printf 'position\tflow\tstory_id\tlabel\trelative_png_path\tbyte_size\n' >"$ledger_path"

record_count=${#story_ids[@]}
for ((index = 0; index < record_count; index += 1)); do
  position=$((index + 1))
  printf -v padded_position '%03d' "$position"
  flow=${flows[$index]}
  story_id=${story_ids[$index]}
  ready_target=${ready_targets[$index]}
  settle_delay=${settle_delays[$index]}
  label=${labels[$index]}
  relative_png_path="$flow/$padded_position-$story_id.png"
  frame_path="$output_path/$relative_png_path"

  mkdir -p -- "$(dirname -- "$frame_path")"
  adb logcat -c

  STORYBOOK_READY_TARGET=$ready_target \
    STORYBOOK_SETTLE_DELAY=$settle_delay \
    "$capture_command" "$story_id" "$frame_path" || {
    capture_status=$?
    echo "storybook-capture-all: capture failed at position $position for story: $story_id" >&2
    exit "$capture_status"
  }

  if ! runtime_logs=$(adb logcat -d -v raw -s ReactNativeJS:I '*:S'); then
    fail "could not read ReactNativeJS logs after capturing story: $story_id"
  fi
  expected_log="STORYBOOK: Linking event received, navigating to story: $story_id"
  if ! grep -Fqx -- "$expected_log" <<<"$runtime_logs"; then
    fail "runtime identity check failed at position $position for story: $story_id"
  fi
  ready_kind=${ready_target%%:*}
  ready_value=${ready_target#*:}
  story_ready_test_id="STORYBOOK.flow-ready.$story_id"
  route_ready_test_id="$story_ready_test_id.$ready_value"
  if ! ui_dump=$(adb exec-out uiautomator dump /dev/tty 2>/dev/null); then
    fail "could not read Android UI hierarchy after capturing story: $story_id"
  fi
  if ! grep -Fq -- "resource-id=\"$story_ready_test_id\"" <<<"$ui_dump"; then
    fail "current story readiness check failed at position $position for story: $story_id"
  fi
  if [[ $ready_kind == route ]]; then
    if ! grep -Fq -- "resource-id=\"$route_ready_test_id\"" <<<"$ui_dump"; then
      fail "current native readiness check failed at position $position for story: $story_id; expected route: $ready_value"
    fi
  else
    if ! grep -Fq -- "resource-id=\"$ready_value\"" <<<"$ui_dump"; then
      fail "current native readiness check failed at position $position for story: $story_id; expected testID: $ready_value"
    fi
  fi

  byte_size=$(wc -c <"$frame_path")
  byte_size=${byte_size//[[:space:]]/}
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$padded_position" \
    "$flow" \
    "$story_id" \
    "$label" \
    "$relative_png_path" \
    "$byte_size" >>"$ledger_path"
done

echo "storybook-capture-all: captured $record_count frame(s) in $output_path"
