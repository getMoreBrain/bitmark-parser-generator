#!/usr/bin/env bash
# =============================================================================
# comment-prs-issues.sh
# =============================================================================
# Test script for the "Comment on PRs and Issues" step from release.yml
#
# This script simulates what happens during a release when we comment on
# all related PRs and Issues to notify them that they've been released.
#
# Usage:
#   ./scripts/comment-prs-issues.sh
#
# Prerequisites:
#   - gh CLI installed and authenticated
#   - GH_TOKEN environment variable set (or gh auth login)
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION - Simulated release data
# =============================================================================

# The release tag we're pretending to publish
TAG_NAME="v5.3.2-test"

# PR URLs from the release (these would come from the "Get merged PRs" step)
# In the real workflow: PR_URLS: ${{ steps.prs.outputs.urls }}
PR_URLS="https://github.com/getMoreBrain/bitmark-parser-generator/pull/472
https://github.com/getMoreBrain/bitmark-parser-generator/pull/471"

# Linked issue URLs extracted from PRs' closingIssuesReferences
# In the real workflow: LINKED_ISSUE_URLS: ${{ steps.prs.outputs.linked_issue_urls }}
# These are issues that PRs explicitly close (e.g., "Fixes #123")
# Can include cross-repo issues (e.g., from an umbrella project)
LINKED_ISSUE_URLS="https://github.com/getMoreBrain/cosmic/issues/9142"

# Issue URLs extracted from commit messages
# In the real workflow: COMMIT_ISSUE_URLS: ${{ steps.commits.outputs.issue_urls }}
# These can be full URLs, cross-repo refs converted to URLs, or local refs converted to URLs
COMMIT_ISSUE_URLS=""

# Repository info (used for building release URL)
REPO_OWNER="getMoreBrain"
REPO_NAME="bitmark-parser-generator"

# =============================================================================
# DRY RUN MODE - Set to "false" to actually post comments
# =============================================================================
DRY_RUN="${DRY_RUN:-true}"

# =============================================================================
# MAIN SCRIPT
# =============================================================================

echo "=============================================="
echo "Comment on PRs and Issues - Test Script"
echo "=============================================="
echo ""
echo "Configuration:"
echo "  TAG_NAME:           $TAG_NAME"
PR_COUNT=$(echo "$PR_URLS" | grep -c . 2>/dev/null || true)
[ -z "$PR_COUNT" ] && PR_COUNT=0
LINKED_COUNT=$(echo "$LINKED_ISSUE_URLS" | grep -c . 2>/dev/null || true)
[ -z "$LINKED_COUNT" ] && LINKED_COUNT=0
COMMIT_COUNT=$(echo "$COMMIT_ISSUE_URLS" | grep -c . 2>/dev/null || true)
[ -z "$COMMIT_COUNT" ] && COMMIT_COUNT=0
echo "  PR_URLS:            $PR_COUNT URLs"
echo "  LINKED_ISSUE_URLS:  $LINKED_COUNT URLs"
echo "  COMMIT_ISSUE_URLS:  $COMMIT_COUNT URLs"
echo "  DRY_RUN:            $DRY_RUN"
echo ""

# Build the release URL (in real workflow, uses github.repository context)
RELEASE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/$TAG_NAME"

# The comment body we'll post on each PR/Issue
COMMENT_BODY="🎉 Released in [$TAG_NAME]($RELEASE_URL)"

echo "Comment to post:"
echo "  $COMMENT_BODY"
echo ""

# =============================================================================
# Collect all unique URLs to comment on
# We use an associative array to deduplicate items
# =============================================================================

declare -A URLS_TO_COMMENT

# -----------------------------------------------------------------------------
# Step 1: Add PR URLs from the merged PRs list
# These are PRs that were merged since the last release
# -----------------------------------------------------------------------------
echo "Step 1: Collecting PR URLs..."
while IFS= read -r URL; do
  [ -n "$URL" ] && echo "  Adding $URL" && URLS_TO_COMMENT["$URL"]=1
done <<< "$PR_URLS"

# -----------------------------------------------------------------------------
# Step 2: Add linked issue URLs from PRs
# These come from the closingIssuesReferences field in PR data
# (Issues that PRs explicitly close with "Fixes #X" or "Closes #X")
# Can include cross-repo issues (e.g., from umbrella projects)
# -----------------------------------------------------------------------------
echo "Step 2: Collecting linked issue URLs from PRs..."
while IFS= read -r URL; do
  [ -n "$URL" ] && echo "  Adding $URL (linked from PR)" && URLS_TO_COMMENT["$URL"]=1
done <<< "$LINKED_ISSUE_URLS"

# -----------------------------------------------------------------------------
# Step 3: Add issue URLs from commit messages
# These are full URLs that were extracted/converted from commit messages
# (Full URLs, cross-repo refs like org/repo#123, or local refs like #123)
# -----------------------------------------------------------------------------
echo "Step 3: Collecting issue URLs from commits..."
while IFS= read -r URL; do
  [ -n "$URL" ] && echo "  Adding $URL (from commit)" && URLS_TO_COMMENT["$URL"]=1
done <<< "$COMMIT_ISSUE_URLS"

echo ""
echo "=============================================="
echo "URLs to comment on: ${#URLS_TO_COMMENT[@]}"
echo "=============================================="

# List all URLs we'll comment on
for URL in "${!URLS_TO_COMMENT[@]}"; do
  echo "  - $URL"
done
echo ""

# =============================================================================
# Function to comment on a single URL (PR or Issue)
# gh CLI accepts full URLs directly, making cross-repo commenting simple
# =============================================================================
comment_on_url() {
  local URL="$1"
  local BODY="$2"

  echo "Commenting on: $URL"

  # Detect if it's a PR or issue by URL pattern
  if [[ "$URL" == */pull/* ]]; then
    if [ "$DRY_RUN" = "true" ]; then
      echo "  [DRY RUN] Would run: gh pr comment \"$URL\" --body \"$BODY\""
    else
      gh pr comment "$URL" --body "$BODY" || echo "::warning::Failed to comment on $URL"
    fi
  else
    if [ "$DRY_RUN" = "true" ]; then
      echo "  [DRY RUN] Would run: gh issue comment \"$URL\" --body \"$BODY\""
    else
      gh issue comment "$URL" --body "$BODY" || echo "::warning::Failed to comment on $URL (may lack permissions for cross-repo)"
    fi
  fi
}

# Export function for use with xargs (needed for parallel execution)
export -f comment_on_url
export DRY_RUN

# =============================================================================
# Post comments (in parallel in the real workflow, sequential here for clarity)
# =============================================================================
echo "Posting comments..."
echo ""

for URL in "${!URLS_TO_COMMENT[@]}"; do
  comment_on_url "$URL" "$COMMENT_BODY"
  echo ""
done

echo "=============================================="
echo "Done!"
echo "=============================================="
echo ""
echo "To actually post comments, run with:"
echo "  DRY_RUN=false ./scripts/comment-prs-issues.sh"
