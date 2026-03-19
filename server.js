const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Store active WebSocket connections with user info
const activeUsers = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'USER_ONLINE':
                    handleUserOnline(ws, message);
                    break;
                case 'POST_CREATED':
                    broadcastEvent('POST_CREATED', message.data);
                    break;
                case 'POST_LIKED':
                    broadcastEvent('POST_LIKED', message.data);
                    break;
                case 'COMMENT_ADDED':
                    broadcastEvent('COMMENT_ADDED', message.data);
                    break;
                case 'FRIEND_REQUEST_SENT':
                    notifyUser(message.toUserId, 'FRIEND_REQUEST_SENT', message.data);
                    break;
                case 'FRIEND_REQUEST_ACCEPTED':
                    notifyUser(message.fromUserId, 'FRIEND_REQUEST_ACCEPTED', message.data);
                    break;
                case 'NOTIFICATION_CREATED':
                    notifyUser(message.userId, 'NOTIFICATION_CREATED', message.data);
                    break;
                case 'TYPING':
                    broadcastTypingIndicator(message.userId, message.postId);
                    break;
                case 'USER_OFFLINE':
                    handleUserOffline(message.userId);
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('User disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

function handleUserOnline(ws, message) {
    const { userId, userName } = message;
    activeUsers.set(userId, {
        ws,
        userName,
        onlineSince: new Date(),
        status: 'online'
    });
    
    // Broadcast user is online
    broadcastEvent('USER_STATUS_CHANGED', {
        userId,
        userName,
        status: 'online',
        onlineUsers: Array.from(activeUsers.keys())
    });
}

function handleUserOffline(userId) {
    if (activeUsers.has(userId)) {
        activeUsers.delete(userId);
        broadcastEvent('USER_STATUS_CHANGED', {
            userId,
            status: 'offline',
            onlineUsers: Array.from(activeUsers.keys())
        });
    }
}

function broadcastEvent(type, data) {
    const message = JSON.stringify({ type, data });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function notifyUser(userId, type, data) {
    const userConnection = activeUsers.get(userId);
    if (userConnection && userConnection.ws.readyState === WebSocket.OPEN) {
        userConnection.ws.send(JSON.stringify({ type, data }));
    }
}

function broadcastTypingIndicator(userId, postId) {
    const message = JSON.stringify({
        type: 'TYPING_INDICATOR',
        userId,
        postId
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', activeUsers: activeUsers.size });
});

// Start server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
    console.log(`🚀 WebSocket Server running on ws://localhost:${PORT}`);
    console.log(`📱 Social Network Platform - Real-time Updates Enabled`);
});
