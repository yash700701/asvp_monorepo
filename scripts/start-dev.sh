#!/bin/bash

echo "Starting ASVP dev stack..."

# Start docker infra
docker-compose -f ./docker/docker-compose.yml up -d

echo "Docker dev services started."
echo "Starting Turbo dev in parallel..."

pnpm dev
