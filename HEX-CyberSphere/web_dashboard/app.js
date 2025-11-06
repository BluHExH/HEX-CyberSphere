/*
HEX-CyberSphere Web Dashboard
Real-time monitoring and control interface
*/

// DOM Elements
const systemStatus = document.getElementById('system-status');
const connectionStatus = document.getElementById('connection-status');
const cpuUsage = document.getElementById('cpu-usage');
const memoryUsage = document.getElementById('memory-usage');
const activeTasks = document.getElementById('active-tasks');
const connectedServices = document.getElementById('connected-services');
const cpuProgress = document.getElementById('cpu-progress');
const memoryProgress = document.getElementById('memory-progress');
const activityLog = document.getElementById('activity-log');
const executeTaskBtn = document.getElementById('execute-task');
const taskType = document.getElementById('task-type');
const taskTarget = document.getElementById('task-target');

// WebSocket connection
let socket;

// Initialize dashboard
function initDashboard() {
    // Display banner
    console.log("╔════════════════════════════════════════════════╗");
    console.log("║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║");
    console.log("╚════════════════════════════════════════════════╝");
    console.log("     Web Dashboard Initialized");
    console.log("  Real-time monitoring and control interface");
    console.log("");

    // Connect to WebSocket server
    connectWebSocket();

    // Set up event listeners
    setupEventListeners();

    // Start periodic updates
    setInterval(updateSystemMetrics, 5000);
}

// Connect to WebSocket server
function connectWebSocket() {
    try {
        // In a real implementation, this would connect to the Node.js server
        // For now, we'll simulate the connection
        console.log("Connecting to WebSocket server...");
        
        // Simulate successful connection
        setTimeout(() => {
            systemStatus.className = 'status-indicator online';
            connectionStatus.textContent = 'Connected';
            addLogEntry('Connected to HEX-CyberSphere system', 'success');
            
            // Start simulating real-time data
            simulateRealTimeData();
        }, 1000);
    } catch (error) {
        console.error('WebSocket connection failed:', error);
        systemStatus.className = 'status-indicator offline';
        connectionStatus.textContent = 'Disconnected';
        addLogEntry('Failed to connect to system', 'error');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Execute task button
    if (executeTaskBtn) {
        executeTaskBtn.addEventListener('click', executeTask);
    }

    // Task type change
    if (taskType) {
        taskType.addEventListener('change', updateTaskTargetPlaceholder);
    }
}

// Update task target placeholder based on task type
function updateTaskTargetPlaceholder() {
    if (!taskTarget) return;

    switch (taskType.value) {
        case 'ai_process':
            taskTarget.placeholder = 'Enter data source or model name';
            break;
        case 'security_scan':
            taskTarget.placeholder = 'Enter target IP or domain';
            break;
        case 'web_automation':
            taskTarget.placeholder = 'Enter URL to automate';
            break;
        case 'data_parse':
            taskTarget.placeholder = 'Enter file path or data source';
            break;
        default:
            taskTarget.placeholder = 'Enter target';
    }
}

// Execute task
function executeTask() {
    const type = taskType.value;
    const target = taskTarget.value;

    if (!target) {
        addLogEntry('Please enter a target for the task', 'warning');
        return;
    }

    addLogEntry(`Executing ${type} on ${target}`, 'info');
    
    // Simulate task execution
    setTimeout(() => {
        addLogEntry(`Task ${type} completed successfully`, 'success');
        
        // Update active tasks counter
        const currentTasks = parseInt(activeTasks.textContent) || 0;
        activeTasks.textContent = currentTasks + 1;
        
        // Reset after a delay
        setTimeout(() => {
            const currentTasks = parseInt(activeTasks.textContent) || 0;
            if (currentTasks > 0) {
                activeTasks.textContent = currentTasks - 1;
            }
        }, 10000);
    }, 2000);
}

// Update system metrics
function updateSystemMetrics() {
    // Simulate CPU usage (0-100%)
    const cpu = Math.floor(Math.random() * 100);
    cpuUsage.textContent = `${cpu}%`;
    cpuProgress.style.width = `${cpu}%`;
    cpuProgress.style.backgroundColor = cpu > 80 ? '#ef4444' : cpu > 60 ? '#f59e0b' : '#10b981';

    // Simulate memory usage (0-100%)
    const memory = Math.floor(Math.random() * 100);
    memoryUsage.textContent = `${memory}%`;
    memoryProgress.style.width = `${memory}%`;
    memoryProgress.style.backgroundColor = memory > 80 ? '#ef4444' : memory > 60 ? '#f59e0b' : '#10b981';

    // Simulate connected services (3-8)
    const services = Math.floor(Math.random() * 6) + 3;
    connectedServices.textContent = services;

    // Add a log entry occasionally
    if (Math.random() > 0.7) {
        const messages = [
            'System check completed',
            'Security scan initiated',
            'Data processing in progress',
            'New connection established'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addLogEntry(randomMessage, 'info');
    }
}

// Simulate real-time data
function simulateRealTimeData() {
    // This would normally receive data from WebSocket
    setInterval(() => {
        // Simulate receiving real-time data
        const data = {
            metric: ['cpu', 'memory', 'network'][Math.floor(Math.random() * 3)],
            value: Math.random() * 100,
            timestamp: new Date().toISOString()
        };
        
        // In a real implementation, this would update charts
        console.log('Real-time data:', data);
    }, 3000);
}

// Add log entry
function addLogEntry(message, type = 'info') {
    if (!activityLog) return;

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = `
        <span class="timestamp">${timestamp}</span>
        <span class="message">${message}</span>
    `;
    
    activityLog.prepend(entry);
    
    // Limit log entries to prevent overflow
    if (activityLog.children.length > 50) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, refresh data
        updateSystemMetrics();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // In a real implementation, this would redraw charts
    console.log('Window resized');
});

// Graceful shutdown
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.close();
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        updateSystemMetrics,
        addLogEntry
    };
}