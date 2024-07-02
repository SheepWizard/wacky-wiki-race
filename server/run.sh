#!/bin/bash
docker stop wackywikiraceapi
docker rm wackywikiraceapi
docker build -t nginx-wacky-wiki-race-api .
docker run -d --network nginxproxymanager_default --name=wackywikiraceapi --restart unless-stopped -d nginx-wacky-wiki-race-api
