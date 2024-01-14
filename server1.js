const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));

// Initialize Supabase client
const supabaseUrl = 'https://zfuccurwbaxbbodllptf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWNjdXJ3YmF4YmJvZGxscHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNTk4MzQsImV4cCI6MjAwODczNTgzNH0.EIfUECLq54zM2CGcFohwYemSi7UrMpDaPYx8woQcUWw';
const supabase = createClient(supabaseUrl, supabaseKey);
 
io.on('connection', async (socket) => {
 // Initialize the socket with the chatroom parameter
  const chatroom = socket.handshake.query.chatroom;
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Parse the chatroom from the query parameter
 //const chatroom = socket.handshake.query.chatroom;

  // Handle messages sent by clients
  socket.on('chat message', async (message) => {
    // Broadcast the message to all connected clients in the same chatroom
    socket.broadcast.to(message.chatroom).emit('chat message', message);

    // Insert the message into the Supabase table
    try {
      const { data, error } = await supabase
        .from('Chat_history')
        .insert([
          {
            username: message.username,
            message_text: message.message,
            timestamp: new Date(),
             chatroom: message.chatroom,
          },
        ]);

      if (error) {
        console.error('Error inserting message into Supabase:', error);
      } else {
        console.log('Message inserted into Supabase:', data);
      }
    } catch (error) {
      console.error('Error inserting message into Supabase:', error);
    }
  });

  // Load chat history from Supabase for the specific chatroom
  try {
    const { data, error } = await supabase
      .from('Chat_history')
      .select()
      .eq('chatroom', chatroom)
      .order('timestamp');

    if (error) {
      console.error('Error loading chat history from Supabase:', error);
    } else {
      // Send the chat history data to the user who just joined
      socket.emit('chat history data', data);
    }
  } catch (error) {
    console.error('Error loading chat history from Supabase:', error);
  }

  // Join the socket to a room named after the chatroom
  socket.join(chatroom);
});

// Serve your script.js and other assets
app.get('/script.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/script.js');
});

// Define routes for each chatroom HTML page
app.get('/chatroom1', (req, res) => {
  res.sendFile(__dirname + '/chatroom1.html');
});

app.get('/chatroom2', (req, res) => {
  res.sendFile(__dirname + '/chatroom2.html');
});

app.get('/chatroom3', (req, res) => {
  res.sendFile(__dirname + '/chatroom3.html');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 
});