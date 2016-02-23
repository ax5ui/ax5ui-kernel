#!/usr/bin/env bash
git subsplit init https://github.com/ax5ui/ax5ui-kernel.git
git subsplit publish --heads="gh-pages" --no-tags src/ax5docs:https://github.com/ax5ui/ax5docs.git
git subsplit publish --heads="master" --no-tags src/ax5core:https://github.com/ax5ui/ax5core.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5mask:https://github.com/ax5ui/bootstrap-ax5mask.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5dialog:https://github.com/ax5ui/bootstrap-ax5dialog.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5toast:https://github.com/ax5ui/bootstrap-ax5toast.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5modal:https://github.com/ax5ui/bootstrap-ax5modal.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5calendar:https://github.com/ax5ui/bootstrap-ax5calendar.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5picker:https://github.com/ax5ui/bootstrap-ax5picker.git
git subsplit publish --heads="master" --no-tags src/bootstrap-ax5formatter:https://github.com/ax5ui/bootstrap-ax5formatter.git
rm -rf .subsplit/