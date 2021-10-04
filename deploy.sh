#!/bin/bash
heroku git:clone -a infochat-production
cd ./infochat-production
rm -rf *

cp ../infochat-backend/.* ./
cp ../infochat-backend/*.json ./
cp ../infochat-backend/Procfile ./
cp -R ../infochat-backend/widgets ./
cp -R ../infochat-backend/src ./

cd ../infochat-frontend
npm run build
mv ./build ../infochat-production

cd ../infochat-production
git add .
git commit -m "generate new build"
git push heroku master
cd ../ && rm -rf ./infochat-production

echo Проект успешно задеплоился на Heroku