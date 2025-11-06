# ⚡ HEX-CyberSphere

**Universal Multi-Language Automation & Control Framework**

A cutting-edge automation platform that seamlessly integrates 10 programming languages into one synchronized system for AI-powered, multi-protocol automation.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](docker-compose.yml)

## 🎯 Project Overview

HEX-CyberSphere is a revolutionary automation framework that demonstrates how multiple programming languages can work together in harmony to create a powerful, intelligent automation system. Built with a focus on performance, scalability, and interoperability, it combines the strengths of Python, Java, Node.js, Go, C++, and more.

## 🧩 Languages & Technologies

| Language | Purpose | Components |
|----------|---------|------------|
| **Python** | Core automation brain, AI logic, data parsing | AI Controller, Automation Manager, Security Scanner |
| **Java** | Backend REST API service, multithreaded tasks | REST API, Task Executor |
| **Node.js** | Webhook system, event handler, real-time communication | WebSocket Server, Web Automation |
| **Go** | Lightweight microservice connector | Service Connector, Language Bridge |
| **C++** | High-speed modules for encryption, hashing, compression | Encryption Engine, Compression Module |
| **HTML/CSS/JS** | Frontend dashboard with logs, charts, controls | Web Dashboard, Real-time UI |
| **JSON/YAML** | Configuration files for workflow and API keys | Config Files, Endpoints |
| **Bash** | Start/Stop automation, environment setup | Scripts, Automation |
| **SQL** | Data storage for logs, task history, configs | Database, Data Storage |
| **Docker** | Containerization for portability | Deployment, Isolation |

## 🧠 Core Features

✅ **Multi-language integration bridge** - Seamless communication between all components  
✅ **Web & API automation** - Automated web interactions and API testing  
✅ **AI workflow engine** - Machine learning-powered automation decisions  
✅ **Security scanner** - Port scanning, vulnerability detection, API security  
✅ **Realtime dashboard** - Live status monitoring with interactive charts  
✅ **API endpoint manager** - Dynamic API configuration with YAML  
✅ **Auto-notification system** - Discord, Telegram, Email alerts  
✅ **Log visualization** - Interactive log analysis and report generation  
✅ **Task scheduler** - Cron-like YAML-based task scheduling  
✅ **CLI commands** - Terminal control for automation from anywhere  
✅ **One-click Docker deployment** - Containerized for easy deployment  

## 📁 Project Structure

```
HEX-CyberSphere/
├── core_engine/                      # Python Brain
│   ├── ai_controller.py
│   ├── data_parser.py
│   ├── automation_manager.py
│   ├── security_scanner.py
│   └── notifier.py
│
├── java_service/                     # Java REST API
│   ├── src/main/java/com/hex/api/
│   │   ├── Application.java
│   │   ├── Controller.java
│   │   └── TaskExecutor.java
│   ├── pom.xml
│   └── application.properties
│
├── node_events/                      # Node.js Event System
│   ├── index.js
│   ├── package.json
│   ├── websocket_server.js
│   └── puppeteer_automation.js
│
├── go_microservice/                  # Go Microservice
│   ├── main.go
│   └── connector.go
│
├── cpp_engine/                       # C++ Engine
│   ├── encryptor.cpp
│   ├── compressor.cpp
│   └── hash_core.cpp
│
├── web_dashboard/                    # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   ├── dashboard_api.js
│   └── charts.js
│
├── config/                           # Configuration Files
│   ├── config.json
│   ├── endpoints.yaml
│   └── scheduler.yaml
│
├── scripts/                          # Shell Scripts
│   ├── run.sh
│   ├── setup.sh
│   ├── clean_logs.sh
│   └── deploy_docker.sh
│
├── database/
│   └── hex_data.db
│
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── README.md
└── LICENSE
```

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Git
- At least 4GB RAM recommended

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/BluHExH/HEX-CyberSphere.git
cd HEX-CyberSphere
```

2. **Run the setup script:**
```bash
cd scripts
chmod +x setup.sh
./setup.sh
```

3. **Start the system:**
```bash
chmod +x run.sh
./run.sh
```

### Docker Deployment

For containerized deployment:

```bash
# Build and start all services
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🎛️ Usage

### CLI Interface

The system provides a command-line interface for easy control:

```bash
# Start all services
./scripts/run.sh

# Stop all services
./scripts/stop.sh

# Clean old logs
./scripts/clean_logs.sh

# Deploy with Docker
./scripts/deploy_docker.sh
```

### Web Dashboard

Access the web interface at `http://localhost:8080` to:
- Monitor system status in real-time
- Execute automation tasks
- View logs and analytics
- Configure system settings

### API Endpoints

The system provides REST APIs for integration:

```
GET  /api/status        - System status
POST /api/tasks/execute - Execute automation task
GET  /api/tasks/history - Task execution history
POST /api/security/scan - Perform security scan
GET  /api/logs          - Retrieve system logs
```

## 🔧 Configuration

### System Configuration

Edit `config/config.json` to configure system settings:

```json
{
  "system": {
    "name": "HEX-CyberSphere",
    "version": "1.0.0",
    "environment": "production"
  },
  "services": {
    "python_core": {
      "host": "localhost",
      "port": 5000,
      "enabled": true
    }
  }
}
```

### API Endpoints

Configure API endpoints in `config/endpoints.yaml`:

```yaml
endpoints:
  - name: "Get System Status"
    url: "/api/status"
    method: "GET"
    description: "Retrieve current system status"
    enabled: true
```

### Task Scheduler

Set up scheduled tasks in `config/scheduler.yaml`:

```yaml
schedule:
  - name: "System Health Check"
    cron: "*/5 * * * *"
    command: "python3 ../core_engine/automation_manager.py health_check"
    enabled: true
```

## 🛡️ Security Features

- **Encryption Engine**: AES-256 encryption for sensitive data
- **Hashing Functions**: MD5, SHA-1, SHA-256, SHA-512 for data integrity
- **Security Scanner**: Port scanning and vulnerability detection
- **Access Control**: Role-based access control for APIs

## 📊 Monitoring & Analytics

- Real-time system metrics dashboard
- Interactive charts for performance visualization
- Comprehensive logging with log level filtering
- Automated report generation

## 🤝 Language Integration

The framework demonstrates seamless integration between:

1. **Python** handles AI processing and core automation logic
2. **Java** provides robust REST API services
3. **Node.js** manages real-time event handling and web automation
4. **Go** acts as a lightweight connector between services
5. **C++** delivers high-performance encryption and compression
6. **Web Technologies** provide a responsive dashboard interface

## 📚 API Documentation

### System Status
```
GET /api/status
Response:
{
  "system": "HEX-CyberSphere",
  "version": "1.0.0",
  "services": {
    "python_core": "running",
    "java_api": "running",
    ...
  }
}
```

### Execute Task
```
POST /api/tasks/execute
Body:
{
  "task_name": "ai_process",
  "params": {
    "data": "...",
    "operation": "anomaly_detection"
  }
}
```

### Security Scan
```
POST /api/security/scan
Body:
{
  "target": "example.com",
  "scan_type": "full"
}
```

## 🐳 Docker Architecture

The system uses a multi-container architecture:

- **Python Core**: Automation engine and AI processing
- **Java API**: RESTful web services
- **Node Events**: Real-time communication and web automation
- **Go Service**: Lightweight microservice connector
- **C++ Engine**: High-performance encryption and compression
- **Web Dashboard**: User interface and monitoring
- **Database**: PostgreSQL for data persistence
- **Nginx**: Reverse proxy and load balancing

## 📈 Performance

- **High-speed processing** with C++ modules
- **Scalable architecture** with microservices
- **Real-time communication** with WebSocket
- **Efficient resource usage** with containerization

## 🛠️ Development

### Prerequisites for Development

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y python3 python3-pip openjdk-11-jdk nodejs npm golang build-essential

# Python dependencies
pip3 install -r core_engine/requirements.txt

# Node.js dependencies
cd node_events &amp;&amp; npm install

# Java dependencies
cd java_service &amp;&amp; mvn install
```

### Building C++ Modules

```bash
cd cpp_engine
make install-deps  # Install dependencies
make               # Build engine
make run           # Run engine
```

## 🤖 AI Capabilities

The framework includes advanced AI features:

- **Data Processing**: Automated data analysis and transformation
- **Anomaly Detection**: Machine learning-based anomaly detection
- **Trend Prediction**: Predictive analytics for system behavior
- **Natural Language Processing**: Text analysis and processing

## 🔌 Extensibility

The modular architecture allows easy extension:

1. Add new language components
2. Create custom automation modules
3. Extend API endpoints
4. Add new dashboard widgets
5. Implement custom security checks

## 📝 Logging

The system provides comprehensive logging:

- **Service-specific logs** for debugging
- **Centralized log management** in database
- **Log level filtering** (DEBUG, INFO, WARN, ERROR)
- **Log rotation** to prevent disk space issues

## 📊 Reporting

- **Automated reports** generation
- **Custom report templates**
- **Export to multiple formats** (PDF, CSV, JSON)
- **Scheduled reporting** via email or other channels

## 🆘 Support

For issues and support:
1. Check the [issues](https://github.com/yourusername/HEX-CyberSphere/issues) page
2. Review the documentation
3. Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this framework
- Inspired by the need for multi-language automation solutions
- Built with open-source technologies
