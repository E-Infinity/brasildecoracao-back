#!/bin/bash

echo "Kill all the running PM2 actions"
sudo pm2 kill

echo "Jump to app folder"
cd /home/ubuntu/app

echo "Update app from Git"
git pull

echo "Install app dependencies"
sudo rm -rf node_modules package-lock.json
sudo npm install --unsafe-perm=true --allow-root

echo "Build your app"
sudo npm run build

echo "Run new PM2 action"
sudo cp /home/ubuntu/ecosystem.json ecosystem.json
sudo pm2 start ecosystem.json

echo "Jump to front folder"
cd /home/ubuntu/app

echo "Run new PM2 action"
sudo pm2 start npm --name "Front - BDC" -- run "start" --port 3000