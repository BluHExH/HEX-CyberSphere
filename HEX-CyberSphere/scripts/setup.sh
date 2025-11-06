#!/bin/bash

# HEX-CyberSphere Setup Script
echo "╔════════════════════════════════════════════════╗"
echo "║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║"
echo "╚════════════════════════════════════════════════╝"
echo "     Universal Multi-Language Automation Framework"
echo ""
echo "Setting up HEX-CyberSphere environment..."
echo ""

# Update system packages
echo "Updating system packages..."
sudo apt-get update

# Install required dependencies
echo "Installing system dependencies..."
sudo apt-get install -y \
    python3 python3-pip openjdk-11-jdk nodejs npm golang \
    build-essential sqlite3 docker.io docker-compose \
    libssl-dev zlib1g-dev postgresql-client

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r ../core_engine/requirements.txt

# Setup Java service
echo "Setting up Java service..."
cd ../java_service
# Maven will be used to build the Java service

# Setup Node.js service
echo "Setting up Node.js service..."
cd ../node_events
npm install

# Setup Go service
echo "Setting up Go service..."
cd ../go_microservice
go mod init hex-cybersphere
go mod tidy

# Setup C++ engine
echo "Setting up C++ engine..."
cd ../cpp_engine
make install-deps

# Setup database
echo "Setting up database..."
mkdir -p ../database
cd ../database
# Database will be initialized by Docker

# Make scripts executable
echo "Making scripts executable..."
cd ../scripts
chmod +x *.sh

echo ""
echo "HEX-CyberSphere setup completed successfully!"
echo "Use 'run.sh' to start the system or 'deploy_docker.sh' for containerized deployment."