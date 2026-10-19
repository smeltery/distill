#!/usr/bin/env bash
set -euo pipefail

git fetch origin "$DEFAULT_BRANCH" --tags
head=$(git rev-parse HEAD)
branch_head=$(git rev-parse "origin/$DEFAULT_BRANCH")
if [[ "$head" != "$VERIFIED_SHA" || "$head" != "$branch_head" ]]; then
  echo 'Default branch advanced; wait for CI on its current commit.'
  exit 0
fi

tag=$(git tag --points-at "$head" | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -n 1 || true)
if [[ -z "$tag" ]]; then
  latest=$(git tag --list | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -n 1 || true)
  if [[ -z "$latest" ]]; then
    tag=v0.1.0
  else
    version=${latest#v}
    IFS=. read -r major minor patch <<< "$version"
    tag="v${major}.${minor}.$((10#$patch + 1))"
  fi
  git -c tag.gpgSign=false tag "$tag" "$head"
  git push origin "$tag"
fi

# GITHUB_TOKEN-created tags do not trigger another push workflow.
# Re-dispatch an existing tag when an earlier release attempt failed.
if ! gh release view "$tag" >/dev/null 2>&1; then
  gh workflow run release.yml --ref "$DEFAULT_BRANCH" -f tag="$tag"
else
  echo "Release $tag already exists."
fi
