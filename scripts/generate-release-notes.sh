#!/bin/bash

START_COMMIT_MSG="chore: start v4 development iteration"
END_COMMIT_MSG="chore: start v5 development iteration"

# Get SHAs
START_SHA=$(git log --oneline | grep -F "$START_COMMIT_MSG" | awk '{print $1}' | head -n 1)
END_SHA=$(git log --oneline | grep -F "$END_COMMIT_MSG" | awk '{print $1}' | head -n 1)

if [ -z "$START_SHA" ] || [ -z "$END_SHA" ]; then
  echo "Could not find start or end commit."
  exit 1
fi

# Get ISO8601 timestamps
START_DATE=$(git log -1 --format=%aI "$START_SHA")
END_DATE=$(git log -1 --format=%aI "$END_SHA")

echo "Using release window:"
echo "  $START_DATE ($START_COMMIT_MSG)"
echo "  $END_DATE ($END_COMMIT_MSG)"
echo ""

# Fetch all merged PRs (no search, no limit)
echo "Fetching all merged PRs..."
ALL_PRS=$(gh pr list \
  --state merged \
  --json number,title,body,url,labels,mergedAt \
  --limit 200)

# Filter by merge date
FILTERED_PRS=$(echo "$ALL_PRS" | jq --arg start "$START_DATE" --arg end "$END_DATE" '
  map(select(.mergedAt >= $start and .mergedAt <= $end))')

COUNT=$(echo "$FILTERED_PRS" | jq length)
echo "Found $COUNT PRs in range."

# Format release notes
{
  echo "# Release Notes for v4"
  echo ""
  echo " PRs merged between:"
  echo "> - $START_COMMIT_MSG ($START_DATE, SHA: $START_SHA)"
  echo "> - $END_COMMIT_MSG ($END_DATE, SHA: $END_SHA)"
  echo ""

  echo "$FILTERED_PRS" | jq -r '
  sort_by(.mergedAt)[] |
  (
    "PR #\(.number): \(.title)",
    (
      (.body // "" | split("\n")[] |
        select(test("(?i)(close|fix|resolve)s? #[0-9]+")) |
        capture(".*#(?<issue>[0-9]+).*") |
        "[closed #\(.issue)](https://github.com/digidem/comapeo-mobile/issues/\(.issue))")
      // empty
    ),
    ""  # Always print a blank line at the end of each PR
  )
'

    # Now create the summary list of unique closed issues
  echo "## Closed Issues Summary"
echo ""

# Extract unique issue numbers
ISSUE_NUMBERS=$(echo "$FILTERED_PRS" | jq -r '
  [.[] |
    (.body // "" | split("\n")[] |
      select(test("(?i)(close|fix|resolve)s? #[0-9]+")) |
      capture(".*#(?<issue>[0-9]+).*") |
      .issue)
  ] | unique | .[]')

# Loop through each issue and fetch title via GitHub CLI
while read -r ISSUE; do
  TITLE=$(gh issue view "$ISSUE" --json title -q .title 2>/dev/null)
  if [ -n "$TITLE" ]; then
    echo "[closed #$ISSUE](https://github.com/digidem/comapeo-mobile/issues/$ISSUE): $TITLE"
    echo ""
  fi
done <<< "$ISSUE_NUMBERS"
} > release-notes.md


# # Step 4: Loop through each PR and format output
# echo "$PR_DATA" | jq -r '
#   .[] |
#   "PR #\(.number): \(.title)",
#   "",
#   (.body | split("\n")[] |
#     select(match("(?i)(close|fix|resolve)s? #[0-9]+")) |
#     capture(".*#(?<issue>[0-9]+).*")) as $issue_num |

#   "[closed #\($issue_num.issue)](https://github.com/digidem/comapeo-mobile/issues/\($issue_num.issue))",
#   "------------------------------",
#   "" ' > release-notes.md

