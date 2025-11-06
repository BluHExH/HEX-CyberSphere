/**
 * HEX-CyberSphere WebSocket Server
 * Dedicated WebSocket server for real-time communication
 */

const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store active connections
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log('New WebSocket client connected');
  clients.add(ws);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to HEX-CyberSphere WebSocket Server',
    timestamp: new Date().toISOString()
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      // Process message based on type
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;
          
        case 'subscribe':
          ws.subscriptions = ws.subscriptions || new Set();
          ws.subscriptions.add(data.channel);
          ws.send(JSON.stringify({
            type: 'subscribed',
            channel: data.channel,
            timestamp: new Date().toISOString()
          }));
          break;
          
        case 'unsubscribe':
          if (ws.subscriptions) {
            ws.subscriptions.delete(data.channel);
          }
          ws.send(JSON.stringify({
            type: 'unsubscribed',
            channel: data.channel,
            timestamp: new Date().toISOString()
          }));
          break;
          
        default:
          // Broadcast to all clients
          broadcastMessage({
            type: 'broadcast',
            from: 'client',
            data: data,
            timestamp: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast message to all clients
function broadcastMessage(message) {
  const messageStr = JSON.stringify(message);
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Send system updates periodically
setInterval(() => {
  const systemUpdate = {
    type: 'system_update',
    data: {
      clients: clients.size,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  };
  
  broadcastMessage(systemUpdate);
}, 10000); // Every 10 seconds

// Handle HTTP requests
server.on('request', (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'websocket_server',
      clients: clients.size,
      timestamp: new Date().toISOString()
    }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      system: 'HEX-CyberSphere WebSocket Server',
      version: '1.0.0',
      description: 'Dedicated WebSocket server for real-time communication'
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start server
const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('     WebSocket Server Started');
  console.log(`  Listening on port ${PORT}`);
  console.log('  Real-time communication ready');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down WebSocket server');
  server.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down WebSocket server');
  server.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});