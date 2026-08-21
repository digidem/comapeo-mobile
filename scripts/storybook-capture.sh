#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat >&2 <<'EOF'
Usage: scripts/storybook-capture.sh <story-id> <output-png-path>

Capture a React Native Storybook story from the connected Android emulator.

Environment:
  STORYBOOK_PACKAGE_ID  Android package id (default: com.comapeo.dev)
  STORYBOOK_READY_TARGET Required route:<name> or testID:<id> proof (optional)
  STORYBOOK_READY_TIMEOUT Seconds to wait for target readiness (default: 300)
  STORYBOOK_SETTLE_DELAY Seconds to wait after readiness (default: 2)
EOF
}

if [[ $# -ne 2 ]]; then
  usage
  exit 2
fi

story_id=$1
output_path=$2
package_id=${STORYBOOK_PACKAGE_ID:-com.comapeo.dev}
ready_target=${STORYBOOK_READY_TARGET:-}
ready_timeout=${STORYBOOK_READY_TIMEOUT:-300}
settle_delay=${STORYBOOK_SETTLE_DELAY:-2}

if [[ -z $story_id ]]; then
  echo "storybook-capture: story id must not be empty" >&2
  exit 2
fi

if [[ -z $output_path ]]; then
  echo "storybook-capture: output path must not be empty" >&2
  exit 2
fi

if [[ ! $settle_delay =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "storybook-capture: STORYBOOK_SETTLE_DELAY must be a non-negative number" >&2
  exit 2
fi

ready_kind=
ready_value=
if [[ -n $ready_target ]]; then
  ready_kind=${ready_target%%:*}
  ready_value=${ready_target#*:}
  case $ready_kind in
    route)
      if [[ ! $ready_value =~ ^[A-Za-z][A-Za-z0-9]*$ ]]; then
        echo "storybook-capture: route readiness requires a navigation route name" >&2
        exit 2
      fi
      ;;
    testID)
      if [[ ! $ready_value =~ ^[A-Za-z0-9][A-Za-z0-9._:-]*$ ]]; then
        echo "storybook-capture: testID readiness requires a safe native test ID" >&2
        exit 2
      fi
      ;;
    *)
      echo "storybook-capture: STORYBOOK_READY_TARGET must use route:<name> or testID:<id>" >&2
      exit 2
      ;;
  esac
fi

if [[ ! $ready_timeout =~ ^[1-9][0-9]*$ ]]; then
  echo "storybook-capture: STORYBOOK_READY_TIMEOUT must be a positive integer" >&2
  exit 2
fi

if ! command -v adb >/dev/null 2>&1; then
  echo "storybook-capture: adb was not found; install/configure the Android SDK platform-tools" >&2
  exit 127
fi

output_dir=$(dirname -- "$output_path")
if [[ ! -d $output_dir ]]; then
  echo "storybook-capture: output directory does not exist: $output_dir" >&2
  exit 2
fi

temporary_dir=$(mktemp -d "${TMPDIR:-/tmp}/storybook-capture.XXXXXX")
cleanup() {
  rmdir "$temporary_dir" 2>/dev/null || true
}
trap cleanup EXIT

echo "storybook-capture: waiting for an Android device..." >&2
adb wait-for-device

select_story() {
  adb shell am start \
    -n "${package_id}/.MainActivity" \
    -a android.intent.action.VIEW \
    -d "storybook://x?STORYBOOK_STORY_ID=${story_id}" >/dev/null
}

adb logcat -c
echo "storybook-capture: selecting $story_id" >&2
select_story

expected_identity_log="STORYBOOK: Linking event received, navigating to story: $story_id"
story_ready_test_id="STORYBOOK.flow-ready.$story_id"
route_ready_test_id="$story_ready_test_id.$ready_value"
deadline=$((SECONDS + ready_timeout))
retry_at=$((SECONDS + 5))
ui_probe_at=$SECONDS
identity_seen=false
capture_ready=false

native_readiness_matches() {
  local hierarchy=$1

  grep -Fq -- "resource-id=\"$story_ready_test_id\"" <<<"$hierarchy" ||
    return 1

  case $ready_kind in
    route)
      grep -Fq -- "resource-id=\"$route_ready_test_id\"" <<<"$hierarchy"
      ;;
    testID)
      grep -Fq -- "resource-id=\"$ready_value\"" <<<"$hierarchy"
      ;;
    *)
      return 0
      ;;
  esac
}

# `uiautomator dump` is flaky under emulator memory pressure: the on-device
# helper is sometimes reaped by the guest low-memory killer, or the pull races
# a still-forming window, which surfaces as an empty/truncated read (not valid
# hierarchy XML) rather than as a missing marker. That's a transient read
# failure worth a short retry, bounded by time rather than attempt count since
# one dump takes anywhere from under a second to several seconds on a loaded
# emulator. A well-formed dump that simply lacks the marker is not retried —
# that's real evidence the screen changed, and this check exists specifically
# to catch that between/around the screenshot.
assert_current_native_readiness() {
  local timing=$1
  local dump_deadline=$((SECONDS + 15))
  local hierarchy

  while :; do
    hierarchy=$(timeout 10 adb exec-out uiautomator dump /dev/tty 2>/dev/null) || hierarchy=
    if [[ -z $hierarchy || $hierarchy != *'<hierarchy'* ]]; then
      (( SECONDS < dump_deadline )) || break
      sleep 0.5
      continue
    fi
    if native_readiness_matches "$hierarchy"; then
      return 0
    fi
    echo "storybook-capture: current native readiness check failed $timing for story: $story_id; expected: $ready_target" >&2
    return 1
  done

  echo "storybook-capture: could not read Android UI hierarchy $timing after retrying" >&2
  return 1
}

if [[ $ready_kind == route ]]; then
  echo "storybook-capture: waiting for route $ready_value..." >&2
elif [[ $ready_kind == testID ]]; then
  echo "storybook-capture: waiting for native testID $ready_value..." >&2
else
  echo "storybook-capture: waiting for story selection..." >&2
fi

while (( SECONDS < deadline )); do
  if runtime_logs=$(adb logcat -d -v raw -s ReactNativeJS:I '*:S'); then
    if grep -Fqx -- "$expected_identity_log" <<<"$runtime_logs"; then
      identity_seen=true
    fi

    if [[ $identity_seen == true ]]; then
      if [[ -z $ready_kind ]]; then
        capture_ready=true
        break
      fi

      if (( SECONDS >= ui_probe_at )); then
        if ui_dump=$(timeout 10 adb exec-out uiautomator dump /dev/tty 2>/dev/null) &&
          native_readiness_matches "$ui_dump"; then
          capture_ready=true
          break
        fi
        ui_probe_at=$((SECONDS + 2))
      fi
    fi
  fi

  # A cold app can reach `Running "main"` before Storybook installs its
  # Linking listener. Retry only until the exact selection identity is seen;
  # repeated delivery of the same story ID is idempotent.
  if [[ $identity_seen != true ]] && (( SECONDS >= retry_at )); then
    echo "storybook-capture: retrying unobserved story selection..." >&2
    select_story
    retry_at=$((SECONDS + 5))
  fi
  sleep 0.5
done

if [[ $capture_ready != true ]]; then
  if [[ $identity_seen != true ]]; then
    echo "storybook-capture: timed out waiting for story selection: $expected_identity_log" >&2
  elif [[ $ready_kind == testID ]]; then
    echo "storybook-capture: timed out waiting for native testID: $ready_value" >&2
  else
    echo "storybook-capture: timed out waiting for current native route: $ready_value" >&2
  fi
  exit 1
fi

sleep "$settle_delay"

if [[ -n $ready_kind ]]; then
  assert_current_native_readiness 'immediately before screenshot' || exit 1
fi

remote_path=/sdcard/storybook-capture.png
temporary_path="$temporary_dir/storybook-capture.png"
adb shell screencap -p "$remote_path"

if [[ -n $ready_kind ]]; then
  assert_current_native_readiness 'immediately after screenshot' || exit 1
fi

adb pull "$remote_path" "$temporary_path" >/dev/null

if [[ ! -s $temporary_path ]]; then
  echo "storybook-capture: pulled screenshot is missing or empty" >&2
  exit 1
fi

png_size=$(wc -c <"$temporary_path")
if (( png_size < 1024 )); then
  echo "storybook-capture: pulled screenshot is suspiciously small (${png_size} bytes)" >&2
  exit 1
fi

mv -f -- "$temporary_path" "$output_path"
echo "storybook-capture: wrote $output_path (${png_size} bytes)" >&2
