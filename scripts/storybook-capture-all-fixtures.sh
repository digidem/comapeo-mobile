#!/usr/bin/env bash

set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
repo_root=$(cd -- "$script_dir/.." && pwd -P)
capture_all="$repo_root/scripts/storybook-capture-all.sh"
fixture_root=$(mktemp -d "${TMPDIR:-/tmp}/storybook-capture-all-fixtures.XXXXXX")
bin_dir="$fixture_root/bin"
mkdir -p -- "$bin_dir"

fake_capture="$bin_dir/fake-capture"
# The single-quoted lines below are emitted verbatim into the generated fixture.
# shellcheck disable=SC2016
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'story_id=$1' \
  'output_path=$2' \
  'printf "%s\\t%s\\t%s\\t%s\\n" "$story_id" "$STORYBOOK_SETTLE_DELAY" "$STORYBOOK_READY_TARGET" "$output_path" >>"$FAKE_CAPTURE_CALLS"' \
  'if [[ ${FAKE_CAPTURE_FAIL_ID:-} == "$story_id" ]]; then exit 23; fi' \
  'printf "fake-png:%s\\n" "$story_id" >"$output_path"' \
  'printf "%s\\t%s\\n" "$story_id" "$STORYBOOK_READY_TARGET" >"$FAKE_ADB_STORY_FILE"' \
  >"$fake_capture"

fake_adb="$bin_dir/adb"
# The single-quoted lines below are emitted verbatim into the generated fixture.
# shellcheck disable=SC2016
printf '%s\n' \
  '#!/usr/bin/env bash' \
  'set -euo pipefail' \
  'if [[ ${1:-} == wait-for-device ]]; then exit 0; fi' \
  'if [[ ${1:-} == shell && ${2:-} == am && ${3:-} == force-stop ]]; then' \
  '  : >"$FAKE_ADB_STORY_FILE"' \
  '  exit 0' \
  'fi' \
  'if [[ ${1:-} == shell && ${2:-} == am && ${3:-} == start ]]; then' \
  '  printf "__startup__\\n" >"$FAKE_ADB_STORY_FILE"' \
  '  printf "Starting: Intent { cmp=com.comapeo.dev/.MainActivity }\\n"' \
  '  exit 0' \
  'fi' \
  'if [[ ${1:-} == logcat && ${2:-} == -c ]]; then' \
  '  : >"$FAKE_ADB_STORY_FILE"' \
  '  exit 0' \
  'fi' \
  'if [[ ${1:-} == logcat && ${2:-} == -d ]]; then' \
  '  IFS=$'\''\t'\'' read -r story_id ready_target <"$FAKE_ADB_STORY_FILE" || true' \
  '  if [[ $story_id == __startup__ ]]; then' \
  '    printf '\''Running "main" with {"rootTag":1}\\n'\''' \
  '    exit 0' \
  '  fi' \
  '  if [[ -n ${FAKE_ADB_BAD_IDENTITY:-} ]]; then story_id=wrong-story; fi' \
  '  printf "STORYBOOK: Linking event received, navigating to story: %s\\n" "$story_id"' \
  '  if [[ -z ${FAKE_ADB_NOT_READY:-} && $ready_target == route:* ]]; then' \
  '    ready_route=${ready_target#route:}' \
  '    if [[ -n ${FAKE_ADB_BAD_READY_ROUTE:-} ]]; then ready_route=WrongRoute; fi' \
  '    printf "STORYBOOK: Flow ready for story: %s; route: %s\\n" "$story_id" "$ready_route"' \
  '  fi' \
  '  exit 0' \
  'fi' \
  'if [[ ${1:-} == exec-out && ${2:-} == uiautomator && ${3:-} == dump ]]; then' \
  '  IFS=$'\''\t'\'' read -r story_id ready_target <"$FAKE_ADB_STORY_FILE" || true' \
  '  if [[ -n ${FAKE_ADB_NOT_READY:-} || -z $story_id || $story_id == __startup__ ]]; then' \
  '    printf "<hierarchy />\\n"' \
  '    exit 0' \
  '  fi' \
  '  story_marker="STORYBOOK.flow-ready.$story_id"' \
  '  printf "<hierarchy><node resource-id=\\\"%s\\\" />" "$story_marker"' \
  '  if [[ $ready_target == route:* ]]; then' \
  '    ready_route=${ready_target#route:}' \
  '    if [[ -n ${FAKE_ADB_BAD_READY_ROUTE:-} || -n ${FAKE_ADB_STALE_READY:-} ]]; then ready_route=WrongRoute; fi' \
  '    printf "<node resource-id=\\\"%s.%s\\\" />" "$story_marker" "$ready_route"' \
  '  elif [[ $ready_target == testID:* ]]; then' \
  '    ready_test_id=${ready_target#testID:}' \
  '    if [[ -n ${FAKE_ADB_BAD_TEST_ID:-} ]]; then ready_test_id=wrong.test-id; fi' \
  '    printf "<node resource-id=\\\"%s\\\" />" "$ready_test_id"' \
  '  fi' \
  '  printf "</hierarchy>\\n"' \
  '  exit 0' \
  'fi' \
  'echo "unexpected fake adb invocation: $*" >&2' \
  'exit 2' \
  >"$fake_adb"
chmod +x "$fake_capture" "$fake_adb"

calls_file="$fixture_root/calls.tsv"
story_file="$fixture_root/current-story"
: >"$calls_file"
: >"$story_file"

run_capture_all() {
  local manifest=$1
  local output=$2
  shift 2
  (
    cd -- "$fixture_root"
    env \
      PATH="$bin_dir:$PATH" \
      STORYBOOK_CAPTURE_MANIFEST="$manifest" \
      STORYBOOK_CAPTURE_COMMAND="$fake_capture" \
      FAKE_CAPTURE_CALLS="$calls_file" \
      FAKE_ADB_STORY_FILE="$story_file" \
      "$@" \
      "$capture_all" "$output"
  )
}

expect_failure() {
  local expected_status=$1
  local expected_message=$2
  shift 2
  local output_file="$fixture_root/failure-output.txt"
  set +e
  "$@" >"$output_file" 2>&1
  local status=$?
  set -e
  if [[ $status -ne $expected_status ]]; then
    echo "expected status $expected_status, got $status" >&2
    sed -n '1,120p' "$output_file" >&2
    exit 1
  fi
  if ! grep -Fq -- "$expected_message" "$output_file"; then
    echo "expected failure message not found: $expected_message" >&2
    sed -n '1,120p' "$output_file" >&2
    exit 1
  fi
}

manifest="$fixture_root/comments-and-blanks.tsv"
printf '# fixture manifest\n\n   # space-indented comment\n\t# tab-indented comment\nonboarding\tflows-onboarding--intro\troute:IntroToCoMapeo\t0\t01 Intro\n\nother-flow\tflows-onboarding--success\troute:Success\t1.5\t05 Success\n' >"$manifest"
output_with_spaces="$fixture_root/output with spaces"
run_capture_all "$manifest" "$output_with_spaces" >/dev/null
[[ -s "$output_with_spaces/onboarding/001-flows-onboarding--intro.png" ]]
[[ -s "$output_with_spaces/other-flow/002-flows-onboarding--success.png" ]]
expected_ledger="$fixture_root/expected-ledger.tsv"
printf 'position\tflow\tstory_id\tlabel\trelative_png_path\tbyte_size\n001\tonboarding\tflows-onboarding--intro\t01 Intro\tonboarding/001-flows-onboarding--intro.png\t33\n002\tother-flow\tflows-onboarding--success\t05 Success\tother-flow/002-flows-onboarding--success.png\t35\n' >"$expected_ledger"
cmp "$expected_ledger" "$output_with_spaces/captures.tsv"
grep -Fq 'force_stop_status=passed' "$output_with_spaces/cold-start-provenance.txt"
grep -Fq 'log_clear_status=passed' "$output_with_spaces/cold-start-provenance.txt"
grep -Fq 'launcher_status=passed' "$output_with_spaces/cold-start-provenance.txt"
grep -Fq 'running_main_status=passed' "$output_with_spaces/cold-start-provenance.txt"
grep -Fq 'Running "main"' "$output_with_spaces/cold-start-provenance.txt"
grep -Fq $'flows-onboarding--intro\t0\t' "$calls_file"
grep -Fq $'flows-onboarding--success\t1.5\t' "$calls_file"

: >"$calls_file"
default_manifest_output="$fixture_root/default manifest output"
default_manifest_row_count=$(awk '
  /^[[:space:]]*$/ || /^[[:space:]]*#/ { next }
  { count += 1 }
  END { print count + 0 }
' "$repo_root/.rnstorybook/capture-manifest.tsv")
(
  cd -- "$fixture_root"
  unset STORYBOOK_CAPTURE_MANIFEST
  PATH="$bin_dir:$PATH" \
    STORYBOOK_CAPTURE_COMMAND="$fake_capture" \
    FAKE_CAPTURE_CALLS="$calls_file" \
    FAKE_ADB_STORY_FILE="$story_file" \
    "$capture_all" "$default_manifest_output" >/dev/null
)
[[ $(wc -l <"$default_manifest_output/captures.tsv") -eq $((default_manifest_row_count + 1)) ]]
[[ $(wc -l <"$calls_file") -eq $default_manifest_row_count ]]

: >"$calls_file"
malformed_manifest="$fixture_root/malformed.tsv"
printf 'onboarding\tflows-onboarding--intro\troute:IntroToCoMapeo\t2\n' >"$malformed_manifest"
expect_failure 1 'must contain exactly five tab-separated columns' \
  run_capture_all "$malformed_manifest" "$fixture_root/malformed-output"
[[ ! -s $calls_file ]]

duplicate_manifest="$fixture_root/duplicate.tsv"
printf 'onboarding\tflows-onboarding--intro\troute:IntroToCoMapeo\t2\tIntro\nonboarding\tflows-onboarding--intro\troute:IntroToCoMapeo\t2\tIntro again\n' >"$duplicate_manifest"
expect_failure 1 'repeats story id: flows-onboarding--intro' \
  run_capture_all "$duplicate_manifest" "$fixture_root/duplicate-output"
[[ ! -s $calls_file ]]

invalid_target_manifest="$fixture_root/invalid-target.tsv"
printf 'onboarding\tflows-onboarding--intro\tnot-a-target\t2\tIntro\n' >"$invalid_target_manifest"
expect_failure 1 'has an invalid readiness target: not-a-target' \
  run_capture_all "$invalid_target_manifest" "$fixture_root/invalid-target-output"
[[ ! -s $calls_file ]]

invalid_delay_manifest="$fixture_root/invalid-delay.tsv"
printf 'onboarding\tflows-onboarding--intro\troute:IntroToCoMapeo\t-1\tIntro\n' >"$invalid_delay_manifest"
expect_failure 1 'has an invalid settle delay: -1' \
  run_capture_all "$invalid_delay_manifest" "$fixture_root/invalid-delay-output"
[[ ! -s $calls_file ]]

missing_story_manifest="$fixture_root/missing-story.tsv"
printf 'onboarding\tnot-in-source-index--missing\troute:IntroToCoMapeo\t2\tMissing\n' >"$missing_story_manifest"
expect_failure 1 'manifest stories missing from source index: not-in-source-index--missing' \
  run_capture_all "$missing_story_manifest" "$fixture_root/missing-story-output"
[[ ! -s $calls_file ]]

failure_manifest="$fixture_root/capture-failure.tsv"
printf 'onboarding\tflows-onboarding--intro\troute:IntroToCoMapeo\t0\tIntro\nonboarding\tflows-onboarding--success\troute:Success\t0\tSuccess\n' >"$failure_manifest"
failure_output="$fixture_root/capture-failure-output"
expect_failure 23 'capture failed at position 2 for story: flows-onboarding--success' \
  run_capture_all "$failure_manifest" "$failure_output" \
    FAKE_CAPTURE_FAIL_ID=flows-onboarding--success
[[ $(wc -l <"$calls_file") -eq 2 ]]
[[ $(wc -l <"$failure_output/captures.tsv") -eq 2 ]]
if grep -Fq $'002\tonboarding\tflows-onboarding--success' "$failure_output/captures.tsv"; then
  echo 'failed capture was written to the ledger' >&2
  exit 1
fi

: >"$calls_file"
identity_output="$fixture_root/identity-failure-output"
expect_failure 1 'runtime identity check failed at position 1 for story: flows-onboarding--intro' \
  run_capture_all "$failure_manifest" "$identity_output" FAKE_ADB_BAD_IDENTITY=1
[[ $(wc -l <"$calls_file") -eq 1 ]]
[[ $(wc -l <"$identity_output/captures.tsv") -eq 1 ]]

: >"$calls_file"
readiness_output="$fixture_root/readiness-failure-output"
expect_failure 1 'current story readiness check failed at position 1 for story: flows-onboarding--intro' \
  run_capture_all "$failure_manifest" "$readiness_output" FAKE_ADB_NOT_READY=1
[[ $(wc -l <"$calls_file") -eq 1 ]]
[[ $(wc -l <"$readiness_output/captures.tsv") -eq 1 ]]

: >"$calls_file"
wrong_route_output="$fixture_root/wrong-route-output"
expect_failure 1 'current native readiness check failed at position 1 for story: flows-onboarding--intro; expected route: IntroToCoMapeo' \
  run_capture_all "$failure_manifest" "$wrong_route_output" FAKE_ADB_BAD_READY_ROUTE=1
[[ $(wc -l <"$calls_file") -eq 1 ]]
[[ $(wc -l <"$wrong_route_output/captures.tsv") -eq 1 ]]

: >"$calls_file"
stale_route_output="$fixture_root/stale-route-output"
expect_failure 1 'current native readiness check failed at position 1 for story: flows-onboarding--intro; expected route: IntroToCoMapeo' \
  run_capture_all "$failure_manifest" "$stale_route_output" FAKE_ADB_STALE_READY=1
[[ $(wc -l <"$calls_file") -eq 1 ]]
[[ $(wc -l <"$stale_route_output/captures.tsv") -eq 1 ]]

: >"$calls_file"
test_id_manifest="$fixture_root/test-id.tsv"
printf 'create-observation\tflows-createobservation--home\ttestID:MAIN.map-screen\t0\tHome\n' >"$test_id_manifest"
test_id_output="$fixture_root/test-id-output"
run_capture_all "$test_id_manifest" "$test_id_output" >/dev/null
[[ $(wc -l <"$test_id_output/captures.tsv") -eq 2 ]]

: >"$calls_file"
missing_test_id_output="$fixture_root/missing-test-id-output"
expect_failure 1 'current story readiness check failed at position 1 for story: flows-createobservation--home' \
  run_capture_all "$test_id_manifest" "$missing_test_id_output" FAKE_ADB_NOT_READY=1
[[ $(wc -l <"$calls_file") -eq 1 ]]
[[ $(wc -l <"$missing_test_id_output/captures.tsv") -eq 1 ]]

: >"$calls_file"
nonempty_output="$fixture_root/nonempty-output"
mkdir -p -- "$nonempty_output"
printf 'keep\n' >"$nonempty_output/existing.txt"
expect_failure 1 'output directory is not empty' \
  run_capture_all "$failure_manifest" "$nonempty_output"
[[ -f "$nonempty_output/existing.txt" ]]
[[ ! -s $calls_file ]]

echo "storybook-capture-all fixtures: PASS"
