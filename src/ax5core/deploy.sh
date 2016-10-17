LOG=`git log --pretty=oneline --abbrev-commit -1`

case "$LOG" in
  *MAJOR@*) echo "Major Version!"; VERSION=$(npm version major) ;;
  *MINOR@*) echo "Minor Version!";VERSION=$(npm version minor) ;;
  *)       echo "Patch Version!";VERSION=$(npm version patch) ;;
esac

VERSION=$(echo $VERSION | cut -c 2-)

npm install && gulp

git add *

git commit -m "$VERSION Released" && git push origin master

git tag -a $VERSION -m $VERSION || true

git push origin HEAD:master --follow-tags --force || true

npm publish || true
