#!/bin/bash

# HEX-CyberSphere Docker Deployment
echo "Deploying HEX-CyberSphere with Docker..."

# Build Docker images
echo "Building Docker images..."
cd ..
docker-compose build

# Start services
echo "Starting Docker containers..."
docker-compose up -d

# Show running containers
echo "Running containers:"
docker-compose ps

echo ""
echo "HEX-CyberSphere deployed successfully!"
echo "Web Dashboard: http://localhost:8080"
echo "API Service: http://localhost:8081"
echo "Real-time Dashboard: http://localhost:3000"