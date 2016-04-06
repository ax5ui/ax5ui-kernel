VERSION=`jq '.version' package.json | sed -e 's/^"//'  -e 's/"$//'`

git tag -a VERSION -m VERSION

git push origin master

npm publish