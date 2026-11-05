#!/usr/bin/env bash
#
# Export the design system's source of truth from the PoGoLeiria monorepo.
#
# The monorepo is read-only for this project: this script only reads committed
# history with `git archive`, so an agent's uncommitted work in /root/PoGoLeiria
# can never leak into the design site. The exported tree is pinned by the
# commit SHA recorded in vendor/SOURCE, and tests/vendor.test.ts proves the
# committed vendor directory is byte-for-byte that archive.
#
# Usage: scripts/sync-source.sh <sha>
#   POGOLEIRIA_REPO=/path/to/PoGoLeiria scripts/sync-source.sh <sha>
set -euo pipefail

if [[ $# -ne 1 || -z "${1:-}" ]]; then
  echo "usage: scripts/sync-source.sh <sha>" >&2
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_REPO="${POGOLEIRIA_REPO:-/root/PoGoLeiria}"

# Exactly the files the site consumes. Adding a path here means check-drift and
# the byte-for-byte test start watching it too.
SYNCED_PATHS=(
  packages/ui
  DESIGN.md
  apps/landing/app/globals.css
  apps/landing/lib/domain-colors.ts
  apps/landing/lib/team-colors.ts
)

if [[ ! -d "$SOURCE_REPO/.git" ]]; then
  echo "error: $SOURCE_REPO is not a git checkout" >&2
  exit 1
fi

SHA="$(git -C "$SOURCE_REPO" rev-parse --verify "$1^{commit}")"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# --format=tar is stable across git versions; the content is the commit's tree,
# not the working tree (uncommitted changes are ignored by design).
git -C "$SOURCE_REPO" archive --format=tar "$SHA" -- "${SYNCED_PATHS[@]}" | tar -x -C "$TMP"

rm -rf "$REPO_ROOT/vendor/pogoleiria"
mkdir -p "$REPO_ROOT/vendor/pogoleiria"
cp -a "$TMP/." "$REPO_ROOT/vendor/pogoleiria/"
printf '%s\n' "$SHA" > "$REPO_ROOT/vendor/SOURCE"

FILES="$(find "$REPO_ROOT/vendor/pogoleiria" -type f | wc -l | tr -d ' ')"
echo "synced $FILES files from $SOURCE_REPO at $SHA"
echo "wrote vendor/SOURCE"
