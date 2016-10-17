LOG=git log -p -1

case "$LOG" in
  *[MAJOR]*) VERSION=$(npm version major) ;;
  *[MINOR]*) VERSION=$(npm version minor) ;;
  *)       VERSION=$(npm version patch) ;;
esac

VERSION=$(echo $VERSION | cut -c 2-)

gulp build

git tag -a $VERSION -m $VERSION || true

git push origin HEAD:master --follow-tags --force || true

npm publish || true
