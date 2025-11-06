# HEX-CyberSphere Dockerfile
# Multi-stage build for all components

# Base stage with common dependencies
FROM ubuntu:22.04 AS base

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install common dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    vim \
    nano \
    python3 \
    python3-pip \
    openjdk-11-jdk \
    nodejs \
    npm \
    golang \
    libssl-dev \
    zlib1g-dev \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin
ENV GOPATH=/go
ENV PATH=$PATH:$GOPATH/bin

# Python stage
FROM base AS python-stage

# Copy Python requirements
COPY core_engine/ /app/core_engine/
COPY config/ /app/config/

# Install Python dependencies
RUN pip3 install flask requests pandas numpy scikit-learn tensorflow torch PyYAML

# Java stage
FROM base AS java-stage

# Copy Java service
COPY java_service/ /app/java_service/

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Build Java service
WORKDIR /app/java_service
RUN mvn clean package

# Node.js stage
FROM base AS node-stage

# Copy Node.js service
COPY node_events/ /app/node_events/

# Install Node.js dependencies
WORKDIR /app/node_events
RUN npm install

# Go stage
FROM base AS go-stage

# Copy Go service
COPY go_microservice/ /app/go_microservice/

# Install Go dependencies and build
WORKDIR /app/go_microservice
RUN go mod init hex-cybersphere || true
RUN go mod tidy
RUN go build -o go_microservice .

# C++ stage
FROM base AS cpp-stage

# Copy C++ engine
COPY cpp_engine/ /app/cpp_engine/

# Build C++ engine
WORKDIR /app/cpp_engine
RUN make install-deps
RUN make

# Final stage
FROM base AS final

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Copy built components from previous stages
COPY --from=python-stage /app/core_engine/ ./core_engine/
COPY --from=python-stage /app/config/ ./config/
COPY --from=java-stage /app/java_service/target/*.jar ./java_service/app.jar
COPY --from=node-stage /app/node_events/ ./node_events/
COPY --from=go-stage /app/go_microservice/go_microservice ./go_microservice/
COPY --from=cpp-stage /app/cpp_engine/cpp_engine ./cpp_engine/

# Copy web dashboard
COPY web_dashboard/ ./web_dashboard/
COPY scripts/ ./scripts/
COPY database/ ./database/

# Make scripts executable
RUN chmod +x ./scripts/*.sh

# Expose ports
EXPOSE 8080 8081 3000 8082 8083

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Default command
CMD ["./scripts/run.sh"]