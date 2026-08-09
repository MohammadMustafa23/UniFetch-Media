#!/bin/bash

set -e

DENO_DIR="/opt/render/project/deno"

echo "=============================================="
echo "Installing Deno"
echo "=============================================="

curl -fsSL https://deno.land/install.sh | DENO_INSTALL="$DENO_DIR" sh

"$DENO_DIR/bin/deno" --version

echo "Deno installed successfully"

echo "=============================================="