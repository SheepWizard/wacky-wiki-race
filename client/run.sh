#!/bin/bash

docker stop wackywikirace
docker rm wackywikirace
docker build -t nginx-wacky-wiki-race .
docker run -d --network nginxproxymanager_default --name=wackywikirace --restart unless-stopped -d nginx-wacky-wiki-race
