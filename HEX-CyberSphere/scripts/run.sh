#!/bin/bash

# HEX-CyberSphere CLI Interface
# Display banner
echo "╔════════════════════════════════════════════════╗"
echo "║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║"
echo "╚════════════════════════════════════════════════╝"
echo "     Universal Multi-Language Automation Framework"
echo "  Python | Java | Node | Go | C++ | HTML | JS | YAML | SQL | Bash"
echo ""
echo "Starting HEX-CyberSphere Automation Framework..."
echo ""

# Check if system is already running
if [ -f "/tmp/hex-cybersphere.pid" ]; then
    echo "HEX-CyberSphere is already running with PID: $(cat /tmp/hex-cybersphere.pid)"
    echo "Use 'stop.sh' to stop the system first."
    exit 1
fi

# Start all services
echo "Starting services..."
echo "1. Starting Python Core Engine..."
python3 ../core_engine/automation_manager.py & PYTHON_PID=$!
echo "2. Starting Java REST API Service..."
cd ../java_service && mvn spring-boot:run & JAVA_PID=$!
echo "3. Starting Node.js Event System..."
cd ../node_events && node index.js & NODE_PID=$!
echo "4. Starting Go Microservice..."
cd ../go_microservice && go run main.go & GO_PID=$!
echo "5. Starting C++ Engine..."
cd ../cpp_engine && ./cpp_engine & CPP_PID=$!
echo "6. Starting Web Dashboard..."
cd ../web_dashboard && python3 -m http.server 8080 & WEB_PID=$!

# Save PIDs to file
echo "$PYTHON_PID $JAVA_PID $NODE_PID $GO_PID $CPP_PID $WEB_PID" > /tmp/hex-cybersphere.pid

echo ""
echo "All services started successfully!"
echo "Web Dashboard available at: http://localhost:8080"
echo "API endpoints available at: http://localhost:8081"
echo "Real-time dashboard: http://localhost:3000"
echo ""
echo "Use 'stop.sh' to stop all services."