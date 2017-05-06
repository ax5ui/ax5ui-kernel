#!/usr/bin/env bash

LOG=`git log --pretty=oneline --abbrev-commit -1`

rm -rf .subsplit

case "$LOG" in
  *MAJOR@*) echo "Major Version"; VERSION_TYPE="MAJOR";;
  *MINOR@*) echo "Minor version"; VERSION_TYPE="MINOR";;
  *PATCH@*) echo "Patch Version"; VERSION_TYPE="PATCH";;
esac

if [ $VERSION_TYPE ]
then
    git checkout master

    git pull origin master

    case "$VERSION_TYPE" in
      *MAJOR*) VERSION=$(npm version major --force);;
      *MINOR*) VERSION=$(npm version minor --force);;
      *PATCH*) VERSION=$(npm version patch --force);;
    esac

    VERSION=$(echo $VERSION | cut -c 2-)

    echo "VERSION : " $VERSION

    echo "START VERSION UP PROCESS"

    npm install && gulp version

    git add *

    echo "Git Commit & Push"

    git commit -m "$VERSION RELEASED" && git pull origin master && git push origin master
fi

echo "Start git Subsplit"

git subsplit init git@github.com:ax5ui/ax5ui-kernel.git
git subsplit publish --heads="master" --no-tags src/ax5core:git@github.com:ax5ui/ax5core.git
git subsplit publish --heads="master" --no-tags src/ax5ui-docker:git@github.com:ax5ui/ax5ui-docker.git
git subsplit publish --heads="master" --no-tags src/ax5ui-uploader:git@github.com:ax5ui/ax5ui-uploader.git
git subsplit publish --heads="master" --no-tags src/ax5ui-grid:git@github.com:ax5ui/ax5ui-grid.git
git subsplit publish --heads="master" --no-tags src/ax5ui-dialog:git@github.com:ax5ui/ax5ui-dialog.git
git subsplit publish --heads="master" --no-tags src/ax5ui-toast:git@github.com:ax5ui/ax5ui-toast.git
git subsplit publish --heads="master" --no-tags src/ax5ui-modal:git@github.com:ax5ui/ax5ui-modal.git
git subsplit publish --heads="master" --no-tags src/ax5ui-calendar:git@github.com:ax5ui/ax5ui-calendar.git
git subsplit publish --heads="master" --no-tags src/ax5ui-picker:git@github.com:ax5ui/ax5ui-picker.git
git subsplit publish --heads="master" --no-tags src/ax5ui-formatter:git@github.com:ax5ui/ax5ui-formatter.git
git subsplit publish --heads="master" --no-tags src/ax5ui-menu:git@github.com:ax5ui/ax5ui-menu.git
git subsplit publish --heads="master" --no-tags src/ax5ui-select:git@github.com:ax5ui/ax5ui-select.git
git subsplit publish --heads="master" --no-tags src/ax5ui-media-viewer:git@github.com:ax5ui/ax5ui-media-viewer.git
git subsplit publish --heads="master" --no-tags src/ax5ui-combobox:git@github.com:ax5ui/ax5ui-combobox.git
git subsplit publish --heads="master" --no-tags src/ax5ui-layout:git@github.com:ax5ui/ax5ui-layout.git
git subsplit publish --heads="master" --no-tags src/ax5ui-binder:git@github.com:ax5ui/ax5ui-binder.git
git subsplit publish --heads="master" --no-tags src/ax5ui-autocomplete:git@github.com:ax5ui/ax5ui-autocomplete.git
git subsplit publish --heads="master" --no-tags src/ax5ui-mask:git@github.com:ax5ui/ax5ui-mask.git
git subsplit publish --heads="master" --no-tags src/ax5ui-palette:git@github.com:ax5ui/ax5ui-palette.git
rm -rf .subsplit/