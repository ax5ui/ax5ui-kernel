#!/usr/bin/env bash
LOG=`git log --pretty=oneline --abbrev-commit -1`

case "$LOG" in
  *MAJOR@*) VERSION=$(npm version major --force) ;;
  *MINOR@*) VERSION=$(npm version minor --force) ;;
  *)       VERSION=$(npm version patch --force) ;;
esac

VERSION=$(echo $VERSION | cut -c 2-)

yarn && gulp version

git add *

