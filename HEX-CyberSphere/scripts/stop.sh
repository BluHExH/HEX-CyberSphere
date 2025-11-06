#!/bin/bash

# HEX-CyberSphere Stop Script
echo "Stopping HEX-CyberSphere Automation Framework..."

# Check if system is running
if [ ! -f "/tmp/hex-cybersphere.pid" ]; then
    echo "HEX-CyberSphere is not running."
    exit 1
fi

# Read PIDs from file
PIDS=$(cat /tmp/hex-cybersphere.pid)

# Kill all processes
echo "Stopping processes: $PIDS"
kill $PIDS 2>/dev/null

# Wait a moment for processes to terminate
sleep 2

# Force kill any remaining processes
kill -9 $PIDS 2>/dev/null

# Remove PID file
rm /tmp/hex-cybersphere.pid

echo "HEX-CyberSphere stopped successfully."