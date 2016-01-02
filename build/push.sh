#!/usr/bin/env bash
git checkout gh-pages && git rebase master --f && git push && git checkout master
