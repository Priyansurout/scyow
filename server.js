const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS

const app = express();
const server = http.createServer(app);

// Enable CORS for Express
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST"],
}));

// Socket.IO setup with CORS
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Allow requests from React
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('syncVideo', (data) => {
        console.log(data)
        socket.broadcast.emit('syncVideo', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
