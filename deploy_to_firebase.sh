#!/bin/bash
set -e

# ==========================================================
# 🚀 GitHub → Firebase Hosting Deployment Script
# ==========================================================

REPO_URL="https://github.com/VNDR-MUSIC/VSD.git"
BRANCH="main"
PROJECT_ROOT=$(pwd)
LOG_FILE="$PROJECT_ROOT/deploy_log.txt"

GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
RESET="\033[0m"

echo -e "${YELLOW}🔹 Pulling latest $BRANCH from GitHub...${RESET}"
if [ -d ".git" ]; then
  git fetch origin $BRANCH
    git reset --hard origin/$BRANCH
    else
      git clone $REPO_URL .
        git checkout $BRANCH
        fi

        echo -e "${YELLOW}🔹 Installing dependencies...${RESET}"
        npm install | tee -a "$LOG_FILE"

        echo -e "${YELLOW}🔹 Building project...${RESET}"
        npm run build | tee -a "$LOG_FILE"

        echo -e "${YELLOW}🔹 Deploying to Firebase Hosting...${RESET}"
        firebase deploy --only hosting | tee -a "$LOG_FILE"

        echo -e "${GREEN}✅ Deployment complete!${RESET}"
        echo -e "🔍 Logs saved in $LOG_FILE"
        echo -e "🌐 Check Firebase Console for your live URL."