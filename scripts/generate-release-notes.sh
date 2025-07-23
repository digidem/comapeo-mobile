#!/bin/bash

MINOR_VERSION=$(jq -r .version package.json | cut -d. -f2)

START_COMMIT_MSG="chore: start v$MINOR_VERSION development iteration"
END_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") # current UTC time

RELEASE_NOTES_FILE="release-notes/closed-prs-v$MINOR_VERSION.md"
CLOSED_ISSUES_FILE="release-notes/closed-issues-v$MINOR_VERSION.md"

mkdir -p release-notes

# Get SHAs
START_SHA=$(git log --oneline | grep -F "$START_COMMIT_MSG" | awk '{print $1}' | head -n 1)


if [ -z "$START_SHA" ];  then
  echo "Could not find start commit."
  exit 0
fi

# Get ISO8601 timestamps
START_DATE=$(git log -1 --format=%aI "$START_SHA")

echo "Using release window:"
echo "  $START_DATE ($START_COMMIT_MSG)"
echo "  $END_DATE"
echo ""

# Fetch all merged PRs (no search, no limit)
echo "Fetching all merged PRs..."
ALL_PRS=$(gh pr list \
  --state merged \
  --json number,title,body,url,labels,mergedAt \
  --limit 1000)

# Filter by merge date
FILTERED_PRS=$(echo "$ALL_PRS" | jq --arg start "$START_DATE" --arg end "$END_DATE" '
  map(select(.mergedAt >= $start and .mergedAt <= $end))')

COUNT=$(echo "$FILTERED_PRS" | jq length)
echo "Found $COUNT PRs in range."

# Format release notes
{
  echo "# Closed Prs for v$MINOR_VERSION"
  echo ""
  echo " PRs merged between:"
  echo "> - $START_COMMIT_MSG ($START_DATE, SHA: $START_SHA)"
  echo "> - $END_DATE"
  echo ""

  echo "$FILTERED_PRS" | jq -r '
  sort_by(.mergedAt)[] |
  (
    "PR #\(.number): \(.title)",
    (
      (.body // "" | split("\n")[] |
        select(test("(?i)(close[sd]?|fix(e[sd])?|resolve[sd]?):?\\s*#[0-9]+")) |
        capture(".*#(?<issue>[0-9]+).*") |
        "[closed #\(.issue)](https://github.com/digidem/comapeo-mobile/issues/\(.issue))")
      // empty
    ),
    ""  # Always print a blank line at the end of each PR
  )
'

    # Now create the summary list of unique closed issues
  
  echo ""
} >> "$RELEASE_NOTES_FILE"
{
  echo "# Closed Issues for v$MINOR_VERSION"
  echo ""

# Extract unique issue numbers
ISSUE_NUMBERS=$(echo "$FILTERED_PRS" | jq -r '
  [.[] |
    (.body // "" | split("\n")[] |
      select(test("(?i)(close[sd]?|fix(e[sd])?|resolve[sd]?):?\\s*#[0-9]+")) |
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

} >> "$CLOSED_ISSUES_FILE"

