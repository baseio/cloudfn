#!/bin/sh

SERVER="cloudfn.stream" 
RDIR="/var/www/cloudfn-system"
VERSION="$(node -pe 'require("./package.json").version')"

git add .
git commit -a -m "$VERSION" --quiet
git push origin master --quiet
npm version patch

ssh root@$SERVER 'bash -s' << EOF

cd "$RDIR"
git pull origin master --quiet
npm install

#pm2 restart all
EOF


echo "Done"
