import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.WS_PORT || 8080;

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

export const broadcastNewPost = (post) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: 'NEW_POST', post }));
    }
  });
};

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});
