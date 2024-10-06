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


    socket.on('play', ({ time, playbackSpeed }) => {
      
   
          // Broadcast to everyone except the sender
          socket.broadcast.emit('play', { time, playbackSpeed });
        
      });


    socket.on('pause', ({ time }) => {
       
          socket.broadcast.emit('pause', { time });
        
      });
    
      // Handle mute event
      socket.on('mute', () => {
 
   
          socket.broadcast.emit('mute');
        
      });
    
      // Handle unmute event
      socket.on('unmute', () => {
 

          socket.broadcast.emit('unmute');
        
      });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
