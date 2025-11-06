/**
 * HEX-CyberSphere Node.js Event System
 * Handles real-time communication and web automation
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const puppeteer = require('puppeteer');
const axios = require('axios');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.static('../web_dashboard'));

// Display banner
console.log("╔════════════════════════════════════════════════╗");
console.log("║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║");
console.log("╚════════════════════════════════════════════════╝");
console.log("     Node.js Event System & Web Automation");
console.log("  Listening on port 3000");
console.log("");

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'node_events',
    timestamp: new Date().toISOString()
  });
});

// Web automation endpoint
app.post('/automate', async (req, res) => {
  try {
    const { url, actions, headless = true } = req.body;
    
    console.log(`Starting web automation for: ${url}`);
    
    // Launch browser
    const browser = await puppeteer.launch({ 
      headless: headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Execute actions
    let results = [];
    if (actions && Array.isArray(actions)) {
      for (const action of actions) {
        try {
          let result;
          switch (action.type) {
            case 'click':
              await page.click(action.selector);
              result = `Clicked on ${action.selector}`;
              break;
            case 'type':
              await page.type(action.selector, action.text);
              result = `Typed "${action.text}" into ${action.selector}`;
              break;
            case 'screenshot':
              const screenshot = await page.screenshot({ encoding: 'base64' });
              result = { screenshot, message: 'Screenshot taken' };
              break;
            case 'extract':
              const extracted = await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.textContent : null;
              }, action.selector);
              result = { extracted, selector: action.selector };
              break;
            default:
              result = `Unknown action type: ${action.type}`;
          }
          results.push({ action: action.type, result });
        } catch (error) {
          results.push({ action: action.type, error: error.message });
        }
      }
    }
    
    // Close browser
    await browser.close();
    
    // Emit event to all connected clients
    io.emit('automation_complete', {
      url,
      actions: actions?.length || 0,
      results,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      status: 'success',
      url,
      actions_executed: actions?.length || 0,
      results
    });
  } catch (error) {
    console.error('Web automation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get system metrics
app.get('/metrics', (req, res) => {
  res.json({
    cpu: Math.random() * 100,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send system status to new client
  socket.emit('system_status', {
    status: 'online',
    service: 'node_events',
    timestamp: new Date().toISOString()
  });
  
  // Handle real-time data requests
  socket.on('request_data', (data) => {
    console.log(`Data request from ${socket.id}:`, data);
    
    // Emit sample real-time data
    socket.emit('realtime_data', {
      metric: 'cpu_usage',
      value: Math.random() * 100,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle task status updates
  socket.on('task_update', (taskData) => {
    console.log(`Task update from ${socket.id}:`, taskData);
    
    // Broadcast to all clients
    io.emit('task_status', taskData);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Periodic data emission
setInterval(() => {
  io.emit('system_metrics', {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    network: Math.random() * 1000,
    timestamp: new Date().toISOString()
  });
}, 5000);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HEX-CyberSphere Node.js Event System running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down Node.js Event System...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down Node.js Event System...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});