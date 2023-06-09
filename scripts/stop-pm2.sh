#!/usr/bin/env bash
docker-compose -f docker-compose.yml down;

pm2 delete all