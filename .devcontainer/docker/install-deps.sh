#!/bin/sh
set -e

# Shared dependencies for building and running bitmark-extractor-ai.
# Sourced by both the devcontainer and CI runner Dockerfiles.
apt-get update && apt-get install -y --no-install-recommends \
    jq \
 && apt-get clean -y \
 && rm -rf /var/lib/apt/lists/*