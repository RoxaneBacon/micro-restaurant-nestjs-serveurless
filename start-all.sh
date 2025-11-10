#!/bin/bash

source ./framework.sh

echo "starting all"
docker-compose -p restaurant-nestjs \
               --env-file ./.env.docker \
               --file menu-service/docker-compose-menu.yml \
               --file dining-service/docker-compose-dining.yml \
               --file kitchen-service/docker-compose-kitchen.yml \
               --file gateway/docker-compose-gateway.yml up -d

wait_on_health http://localhost:9500 gateway

sleep 5

docker-compose -p restaurant-nestjs \
               --env-file ./.env.docker \
               --file bff-express-service/docker-compose-bff.yml up -d

echo "all services started behind gateway"
