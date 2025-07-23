#!/bin/bash

MINOR_VERSION=$(jq -r .version package.json | cut -d. -f2)

RELEASE_NOTES_FILE="release-notes/closed-prs-v$MINOR_VERSION.md"
CLOSED_ISSUES_FILE="release-notes/closed-issues-v$MINOR_VERSION.md"

mkdir -p release-notes

# Branch name we're looking for
RC_BRANCH="rc/v$MINOR_VERSION.0"

# Get PR number from that branch
PR_NUMBER=$(gh pr list --head "$RC_BRANCH" --json number --jq '.[0].number')

if [ -z "$PR_NUMBER" ]; then
  echo "❌ No PR found for branch: $RC_BRANCH"
  exit 0
fi

echo "✅ Found PR: #$PR_NUMBER"

# Get PR details including comments
PR_DATA=$(gh pr view "$PR_NUMBER" --comments --json createdAt,comments)

# Extract commit headlines (aka message headers)
COMMIT_HEADERS=$(gh pr view "$PR_NUMBER" --json commits --jq '.commits[]
  | {
      messageHeadline: .messageHeadline,
      createdAt: .committedDate
    }
' | jq -s '.')

echo "Extracted commit headers for PR #$COMMIT_HEADERS"

if [ -z "$COMMIT_HEADERS" ]; then
  echo "❌ No commits found in PR #$PR_NUMBER"
  exit 0
fi

# Extract the PR creation date
pr_created_at=$(echo "$PR_DATA" | jq -r '.createdAt')

# Try to find last comment with body "/build-rc"
cherry_pick_date=$(echo "$PR_DATA" | jq -r --arg body "/build-rc" '
  .comments
  | map(select(.body == $body))
  | sort_by(.createdAt)
  | if length >= 2 then .[-2].createdAt else null end
')

# Set CHERRY_PICK_START_DATE
if [[ -n "$cherry_pick_date" && "$cherry_pick_date" != "null" ]]; then
  CHERRY_PICK_START_DATE="$cherry_pick_date"
else
  CHERRY_PICK_START_DATE="$pr_created_at"
  echo "No '/build-rc' comment found. Using PR creation date: $CHERRY_PICK_START_DATE"
fi

echo "Using cherry-pick start date: $CHERRY_PICK_START_DATE"

FILTERED_COMMITS=$(echo "$COMMIT_HEADERS" | jq --arg start "$CHERRY_PICK_START_DATE" '
  map(select(.createdAt >= $start))
')

# Extract PR numbers from headlines like: fix: something (#1234)
PR_REFERENCES=$(echo "$FILTERED_COMMITS" | grep -oE '\(#([0-9]+)\)' | grep -oE '[0-9]+' | sort -n | uniq)

echo "Found PR references: $PR_REFERENCES"

if [ -z "$PR_REFERENCES" ]; then
  echo "❌ No PR numbers found in commit message headlines"
  exit 0
fi

CHERRY_PICKED_COMMITS="[]"

for pr_number in $PR_REFERENCES; do
  PR_JSON=$(gh pr view "$pr_number" --json title,body,mergedAt,number)
  CHERRY_PICKED_COMMITS=$(jq --argjson new "$PR_JSON" '. += [$new]' <<< "$CHERRY_PICKED_COMMITS")
done

DATE_TIME=$(TZ="America/New_York" date "+%Y-%m-%d %H:%M:%S %Z")


# Format release notes
{
  echo ""
  echo "## Closed Prs cherry picked onto RC created on $DATE_TIME"
  echo "$CHERRY_PICKED_COMMITS" | jq -r '
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
} >> "$RELEASE_NOTES_FILE"
{

  echo ""
  echo "## Closed Issues Added to RC created on $DATE_TIME"
# Extract unique issue numbers
  ISSUE_NUMBERS=$(echo "$CHERRY_PICKED_COMMITS" | jq -r '
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