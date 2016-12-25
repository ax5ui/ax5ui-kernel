LOG = "MAJOR"

case "$LOG" in
  *MAJOR@*) echo "Major Version"; VERSION=$(npm version major --force) ;;
  *MINOR@*) echo "Minor version"; VERSION=$(npm version minor --force) ;;
  *PATCH@*) echo "Patch Version"; VERSION=$(npm version patch --force) ;;
esac

VERSION=$(echo $VERSION | cut -c 2-)

echo $VERSION

#npm install && gulp version

#git add *

#echo "Git Commit & Push"

#git commit -m "$VERSION RELEASED" && git pull origin master && git push origin master

#echo "Start git Subsplit"
