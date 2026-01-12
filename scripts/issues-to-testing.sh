#!/usr/bin/env bash
# =============================================================================
# issues-to-testing.sh
# =============================================================================
# Test script for updating issue status to "Testing on Cosmic" in GitHub Projects
#
# This script demonstrates how to:
# 1. Query the "Get More Brain" organization project
# 2. Find the Status field and "Testing on Cosmic" option
# 3. Check if an issue is in the project
# 4. Update the issue's status field value
#
# This uses the GitHub Projects V2 GraphQL API.
#
# Usage:
#   ./scripts/issues-to-testing.sh
#
# Prerequisites:
#   - gh CLI installed and authenticated
#   - User must have write access to the project
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================

# Organization that owns the project
ORG_NAME="getMoreBrain"

# Project number (from the project URL: github.com/orgs/getMoreBrain/projects/3)
PROJECT_NUMBER=3

# The status option we want to set
TARGET_STATUS="Testing on Cosmic 🥂"

# Test issue URLs - these would come from the release workflow
# In the real workflow, this would be built from:
#   - LINKED_ISSUE_URLS from PRs (closingIssuesReferences[].url)
#   - COMMIT_ISSUE_URLS from commit messages (full URLs, cross-repo refs, local refs)
# URLs can be from any repo (supporting cross-repo issues from umbrella projects)
TEST_ISSUE_URLS="https://github.com/getMoreBrain/cosmic/issues/9142"

# For testing with PRs (to find their linked issues), uncomment:
# TEST_PR_URLS="https://github.com/getMoreBrain/bitmark-parser-generator/pull/472
# https://github.com/getMoreBrain/bitmark-parser-generator/pull/471"

# =============================================================================
# DRY RUN MODE - Set to "false" to actually update project items
# =============================================================================
DRY_RUN="${DRY_RUN:-true}"

# =============================================================================
# MAIN SCRIPT
# =============================================================================

echo "=============================================="
echo "Update Issue Status to 'Testing on Cosmic'"
echo "=============================================="
echo ""
echo "Configuration:"
echo "  ORG_NAME:         $ORG_NAME"
echo "  PROJECT_NUMBER:   $PROJECT_NUMBER"
echo "  TARGET_STATUS:    $TARGET_STATUS"
ISSUE_COUNT=$(echo "$TEST_ISSUE_URLS" | grep -c . 2>/dev/null || true)
[ -z "$ISSUE_COUNT" ] && ISSUE_COUNT=0
echo "  TEST_ISSUE_URLS:  $ISSUE_COUNT URLs"
echo "  DRY_RUN:          $DRY_RUN"
echo ""

# =============================================================================
# Step 1: Get project and field information
# This queries the organization's project to find:
#   - The project's node ID (needed for mutations)
#   - The Status field's ID
#   - All status options and their IDs
# =============================================================================

echo "Step 1: Fetching project information..."
echo ""

PROJECT_QUERY='
query($org: String!, $projectNum: Int!) {
  organization(login: $org) {
    projectV2(number: $projectNum) {
      id
      title
      field(name: "Status") {
        ... on ProjectV2SingleSelectField {
          id
          name
          options {
            id
            name
          }
        }
      }
    }
  }
}'

echo "Running GraphQL query to get project info..."
PROJECT_DATA=$(gh api graphql \
  -f query="$PROJECT_QUERY" \
  -f org="$ORG_NAME" \
  -F projectNum="$PROJECT_NUMBER")

# Check if we got valid data
if echo "$PROJECT_DATA" | jq -e '.errors' > /dev/null 2>&1; then
  echo "ERROR: Failed to fetch project data:"
  echo "$PROJECT_DATA" | jq '.errors'
  exit 1
fi

# Extract the project ID
PROJECT_ID=$(echo "$PROJECT_DATA" | jq -r '.data.organization.projectV2.id')
PROJECT_TITLE=$(echo "$PROJECT_DATA" | jq -r '.data.organization.projectV2.title')

echo "  Project: $PROJECT_TITLE"
echo "  Project ID: $PROJECT_ID"

# Extract the Status field ID
FIELD_ID=$(echo "$PROJECT_DATA" | jq -r '.data.organization.projectV2.field.id')
echo "  Status Field ID: $FIELD_ID"

# Find the "Testing on Cosmic" option ID
OPTION_ID=$(echo "$PROJECT_DATA" | jq -r --arg status "$TARGET_STATUS" \
  '.data.organization.projectV2.field.options[] | select(.name == $status) | .id')

if [ -z "$OPTION_ID" ] || [ "$OPTION_ID" = "null" ]; then
  echo ""
  echo "ERROR: Could not find status option '$TARGET_STATUS'"
  echo ""
  echo "Available status options:"
  echo "$PROJECT_DATA" | jq -r '.data.organization.projectV2.field.options[] | "  - \(.name) (ID: \(.id))"'
  exit 1
fi

echo "  Target Option ID: $OPTION_ID"
echo ""

# =============================================================================
# Step 2: Parse issue URLs to extract owner, repo, and issue number
# URLs have format: https://github.com/{owner}/{repo}/issues/{number}
# =============================================================================

echo "Step 2: Parsing issue URLs..."
echo ""

# Helper function to parse a GitHub issue URL
# Returns: owner repo number (space-separated)
parse_issue_url() {
  local URL="$1"
  # Extract: https://github.com/{owner}/{repo}/issues/{number}
  if [[ "$URL" =~ ^https://github.com/([^/]+)/([^/]+)/issues/([0-9]+)$ ]]; then
    echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]} ${BASH_REMATCH[3]}"
  else
    echo ""
  fi
}

# Collect parsed issue info
declare -a ISSUE_INFO

while IFS= read -r URL; do
  [ -z "$URL" ] && continue

  PARSED=$(parse_issue_url "$URL")
  if [ -n "$PARSED" ]; then
    echo "  ✓ Parsed: $URL"
    echo "    -> $(echo "$PARSED" | awk '{print $1"/"$2" #"$3}')"
    ISSUE_INFO+=("$URL|$PARSED")
  else
    echo "  ✗ Could not parse URL: $URL"
  fi
done <<< "$TEST_ISSUE_URLS"

echo ""
echo "Issues to process: ${#ISSUE_INFO[@]}"
if [ ${#ISSUE_INFO[@]} -eq 0 ]; then
  echo ""
  echo "No issues found. To test with a specific issue, modify TEST_ISSUE_URLS"
  echo "in this script with valid GitHub issue URLs."
  echo ""
fi

# =============================================================================
# Step 3: For each issue, check if it's in the project and update status
# =============================================================================

echo ""
echo "Step 3: Processing issues..."
echo ""

# GraphQL query to get issue's project items
ISSUE_QUERY='
query($owner: String!, $repo: String!, $num: Int!) {
  repository(owner: $owner, name: $repo) {
    issue(number: $num) {
      id
      title
      state
      projectItems(first: 20) {
        nodes {
          id
          project {
            id
            title
          }
        }
      }
    }
  }
}'

# GraphQL mutation to update project item field
UPDATE_MUTATION='
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $projectId
    itemId: $itemId
    fieldId: $fieldId
    value: { singleSelectOptionId: $optionId }
  }) {
    projectV2Item {
      id
    }
  }
}'

for INFO in "${ISSUE_INFO[@]}"; do
  # Parse the stored info: URL|owner repo number
  URL="${INFO%%|*}"
  PARSED="${INFO#*|}"
  REPO_OWNER=$(echo "$PARSED" | awk '{print $1}')
  REPO_NAME=$(echo "$PARSED" | awk '{print $2}')
  ISSUE_NUM=$(echo "$PARSED" | awk '{print $3}')

  echo "Processing: $URL"
  echo "  Repository: $REPO_OWNER/$REPO_NAME"
  echo "  Issue: #$ISSUE_NUM"

  # Get the issue's project items
  ISSUE_DATA=$(gh api graphql \
    -f query="$ISSUE_QUERY" \
    -f owner="$REPO_OWNER" \
    -f repo="$REPO_NAME" \
    -F num="$ISSUE_NUM" 2>/dev/null || echo '{"errors":[{"message":"Issue not found"}]}')

  # Check for errors
  if echo "$ISSUE_DATA" | jq -e '.errors' > /dev/null 2>&1; then
    echo "  ✗ Error fetching issue: $(echo "$ISSUE_DATA" | jq -r '.errors[0].message')"
    continue
  fi

  ISSUE_TITLE=$(echo "$ISSUE_DATA" | jq -r '.data.repository.issue.title // "Unknown"')
  ISSUE_STATE=$(echo "$ISSUE_DATA" | jq -r '.data.repository.issue.state // "Unknown"')
  echo "  Title: $ISSUE_TITLE"
  echo "  State: $ISSUE_STATE"

  # Find the project item ID if this issue is in our target project
  ITEM_ID=$(echo "$ISSUE_DATA" | jq -r --arg pid "$PROJECT_ID" \
    '.data.repository.issue.projectItems.nodes[] | select(.project.id == $pid) | .id')

  if [ -z "$ITEM_ID" ] || [ "$ITEM_ID" = "null" ]; then
    echo "  ✗ Issue is NOT in the '$PROJECT_TITLE' project - skipping"

    # Show which projects the issue IS in (for debugging)
    OTHER_PROJECTS=$(echo "$ISSUE_DATA" | jq -r '.data.repository.issue.projectItems.nodes[].project.title // empty')
    if [ -n "$OTHER_PROJECTS" ]; then
      echo "    Issue is in these projects:"
      echo "$OTHER_PROJECTS" | while read -r proj; do
        echo "      - $proj"
      done
    else
      echo "    Issue is not in any project"
    fi
  else
    echo "  ✓ Issue is in the project (Item ID: $ITEM_ID)"

    if [ "$DRY_RUN" = "true" ]; then
      echo "  [DRY RUN] Would update status to '$TARGET_STATUS'"
      echo "  [DRY RUN] GraphQL mutation would use:"
      echo "    projectId: $PROJECT_ID"
      echo "    itemId: $ITEM_ID"
      echo "    fieldId: $FIELD_ID"
      echo "    optionId: $OPTION_ID"
    else
      echo "  Updating status to '$TARGET_STATUS'..."

      RESULT=$(gh api graphql \
        -f query="$UPDATE_MUTATION" \
        -f projectId="$PROJECT_ID" \
        -f itemId="$ITEM_ID" \
        -f fieldId="$FIELD_ID" \
        -f optionId="$OPTION_ID" 2>&1)

      if echo "$RESULT" | jq -e '.errors' > /dev/null 2>&1; then
        echo "  ✗ Failed to update: $(echo "$RESULT" | jq -r '.errors[0].message')"
      else
        echo "  ✓ Successfully updated status to '$TARGET_STATUS'"
      fi
    fi
  fi

  echo ""
done

echo "=============================================="
echo "Done!"
echo "=============================================="
echo ""
echo "To actually update project items, run with:"
echo "  DRY_RUN=false ./scripts/issues-to-testing.sh"
echo ""
echo "Note: You need 'project' scope in your GitHub token."
echo "If using gh CLI, you may need to re-authenticate with:"
echo "  gh auth refresh -s project"
