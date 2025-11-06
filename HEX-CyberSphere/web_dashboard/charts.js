/*
HEX-CyberSphere Dashboard Charts
Real-time data visualization using Chart.js
*/

// Global chart instances
let systemChart = null;
let cpuChart = null;
let memoryChart = null;

// Initialize charts
function initCharts() {
    // System metrics chart
    const systemCtx = document.getElementById('system-chart');
    if (systemCtx) {
        systemChart = new Chart(systemCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'CPU Usage',
                        data: [],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Memory Usage',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }

    // CPU usage chart
    const cpuCtx = document.getElementById('cpu-chart');
    if (cpuCtx) {
        cpuChart = new Chart(cpuCtx, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Available'],
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [
                        '#2563eb',
                        '#e2e8f0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Memory usage chart
    const memoryCtx = document.getElementById('memory-chart');
    if (memoryCtx) {
        memoryChart = new Chart(memoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Available'],
                datasets: [{
                    data: [0, 100],
                    backgroundColor: [
                        '#10b981',
                        '#e2e8f0'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update system chart with new data
function updateSystemChart(cpu, memory, timestamp) {
    if (!systemChart) return;

    // Add new data point
    systemChart.data.labels.push(timestamp);
    systemChart.data.datasets[0].data.push(cpu);
    systemChart.data.datasets[1].data.push(memory);

    // Keep only last 20 data points
    if (systemChart.data.labels.length > 20) {
        systemChart.data.labels.shift();
        systemChart.data.datasets[0].data.shift();
        systemChart.data.datasets[1].data.shift();
    }

    // Update chart
    systemChart.update();
}

// Update CPU chart
function updateCPUChart(cpu) {
    if (!cpuChart) return;

    cpuChart.data.datasets[0].data = [cpu, 100 - cpu];
    cpuChart.update();
}

// Update memory chart
function updateMemoryChart(memory) {
    if (!memoryChart) return;

    memoryChart.data.datasets[0].data = [memory, 100 - memory];
    memoryChart.update();
}

// Create activity chart
function createActivityChart(data) {
    const ctx = document.getElementById('activity-chart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Activity Count',
                data: data.values,
                backgroundColor: '#2563eb',
                borderColor: '#1d4ed8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create service status chart
function createServiceChart(data) {
    const ctx = document.getElementById('service-chart');
    if (!ctx) return;

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#10b981',
                    '#ef4444',
                    '#f59e0b'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initCharts();

    // Simulate real-time data updates
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const cpu = Math.floor(Math.random() * 100);
        const memory = Math.floor(Math.random() * 100);

        updateSystemChart(cpu, memory, timeString);
        updateCPUChart(cpu);
        updateMemoryChart(memory);
    }, 2000);
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCharts,
        updateSystemChart,
        updateCPUChart,
        updateMemoryChart,
        createActivityChart,
        createServiceChart
    };
}