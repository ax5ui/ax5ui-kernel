#!/usr/bin/env bash
git checkout gh-pages && git rebase master && git push && git checkout master
