#!/usr/bin/env bash
docker-compose -f docker-compose.yml up -d

pm2 start pm2.config.yml --update-env