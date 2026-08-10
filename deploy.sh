#!/usr/bin/env bash

# ==============================================================================
# Tianaluxora Website Frontend Deployment Script
# Target Server Location: /var/www/tianaluxora-website-fe
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

FE_DIR="${FE_DIR:-/var/www/tianaluxora-website-fe}"
BRANCH="${BRANCH:-main}"

echo -e "${CYAN}========================================================================${NC}"
echo -e "${CYAN}            Deploying Tianaluxora Website Frontend                     ${NC}"
echo -e "${CYAN}========================================================================${NC}"

if [ -d "$FE_DIR" ]; then
  cd "$FE_DIR"
fi

echo -e "${YELLOW}➜ Pulling latest frontend code (origin/${BRANCH})...${NC}"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo -e "${YELLOW}➜ Installing npm dependencies...${NC}"
npm install

echo -e "${YELLOW}➜ Building production bundle...${NC}"
npm run build

echo -e "${GREEN}✓ Frontend build and deployment successful!${NC}"
