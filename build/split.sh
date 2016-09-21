#!/usr/bin/env bash
git subsplit init https://github.com/ax5ui/ax5ui-kernel.git
git subsplit publish --heads="master" --no-tags src/ax5core:https://github.com/ax5ui/ax5core.git
git subsplit publish --heads="master" --no-tags src/ax5ui-mask:https://github.com/ax5ui/ax5ui-mask.git
git subsplit publish --heads="master" --no-tags src/ax5ui-dialog:https://github.com/ax5ui/ax5ui-dialog.git
git subsplit publish --heads="master" --no-tags src/ax5ui-toast:https://github.com/ax5ui/ax5ui-toast.git
git subsplit publish --heads="master" --no-tags src/ax5ui-modal:https://github.com/ax5ui/ax5ui-modal.git
git subsplit publish --heads="master" --no-tags src/ax5ui-calendar:https://github.com/ax5ui/ax5ui-calendar.git
git subsplit publish --heads="master" --no-tags src/ax5ui-picker:https://github.com/ax5ui/ax5ui-picker.git
git subsplit publish --heads="master" --no-tags src/ax5ui-formatter:https://github.com/ax5ui/ax5ui-formatter.git
git subsplit publish --heads="master" --no-tags src/ax5ui-menu:https://github.com/ax5ui/ax5ui-menu.git
git subsplit publish --heads="master" --no-tags src/ax5ui-select:https://github.com/ax5ui/ax5ui-select.git
git subsplit publish --heads="master" --no-tags src/ax5ui-grid:https://github.com/ax5ui/ax5ui-grid.git
git subsplit publish --heads="master" --no-tags src/ax5ui-media-viewer:https://github.com/ax5ui/ax5ui-media-viewer.git
git subsplit publish --heads="master" --no-tags src/ax5ui-combobox:https://github.com/ax5ui/ax5ui-combobox.git
git subsplit publish --heads="master" --no-tags src/ax5ui-layout:https://github.com/ax5ui/ax5ui-layout.git
rm -rf .subsplit/



git subsplit init https://github.com/ax5ui/ax5ui-kernel.git
git subsplit publish --heads="master" --no-tags src/ax5core:https://github.com/ax5ui/ax5core.git
rm -rf .subsplit/