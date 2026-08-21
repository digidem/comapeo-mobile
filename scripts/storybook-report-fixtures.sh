#!/usr/bin/env bash

set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
report_script="$script_dir/storybook-report.mjs"
fixture_root=$(mktemp -d "${TMPDIR:-/tmp}/storybook-report-fixtures.XXXXXX")

make_capture_output() {
  local output=$1
  mkdir -p -- "$output/flow"
  printf 'PNG' >"$output/flow/001-story.png"
  printf 'position\tflow\tstory_id\tlabel\trelative_png_path\tbyte_size\n001\tflow\tstory\tStory\tflow/001-story.png\t3\n' >"$output/captures.tsv"
}

expect_failure() {
  local expected=$1
  shift
  local output status
  set +e
  output=$("$@" 2>&1)
  status=$?
  set -e
  if [[ $status -eq 0 ]]; then
    echo "expected report failure" >&2
    exit 1
  fi
  if [[ $output != *"$expected"* ]]; then
    echo "missing expected error '$expected': $output" >&2
    exit 1
  fi
}

flow_escape="$fixture_root/flow-escape"
mkdir -p -- "$fixture_root/outside"
printf 'keep-flow\n' >"$fixture_root/outside/marker"
mkdir -p -- "$flow_escape" "$flow_escape/target"
printf 'PNG' >"$flow_escape/target/001-story.png"
printf 'position\tflow\tstory_id\tlabel\trelative_png_path\tbyte_size\n001\tflow\tstory\tStory\tflow/001-story.png\t3\n' >"$flow_escape/captures.tsv"
ln -s -- "$flow_escape/target" "$flow_escape/flow"
expect_failure 'flow report directory is a symlink' node "$report_script" "$flow_escape"
[[ $(<"$fixture_root/outside/marker") == 'keep-flow' ]]
[[ ! -e "$fixture_root/outside/index.html" ]]

file_escape="$fixture_root/file-escape"
make_capture_output "$file_escape"
printf 'do-not-overwrite\n' >"$fixture_root/outside/sentinel"
ln -s -- "$fixture_root/outside/sentinel" "$file_escape/flow/index.html"
expect_failure 'flow report file is a symlink' node "$report_script" "$file_escape"
[[ $(<"$fixture_root/outside/sentinel") == 'do-not-overwrite' ]]

echo 'storybook-report fixtures: PASS'
