const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const path = require('path'); // Import the 'path' module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;
app.use(express.static(__dirname)); 

// Initialize Supabase client
const supabaseUrl = 'https://zfuccurwbaxbbodllptf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWNjdXJ3YmF4YmJvZGxscHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNTk4MzQsImV4cCI6MjAwODczNTgzNH0.EIfUECLq54zM2CGcFohwYemSi7UrMpDaPYx8woQcUWw';
const supabase = createClient(supabaseUrl, supabaseKey);


io.on('connection', async (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Handle messages sent by clients
  socket.on('chat message', async (message) => {
    // Broadcast the message to all connected clients
    socket.broadcast.emit('chat message', message);

    // Insert the message into the Supabase table
    try {
      const { data, error } = await supabase
        .from('Affirmation_slaytion') // Use the new table 'Affirmation_slaytion'
        .insert([
          {
            username: message.username,
            affirmation_text: message.message, // Update the column name
            timestamp: new Date(),
            chatroom: 'affirmationslaytion',
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

  // Load chat history from Supabase
  try {
    const { data, error } = await supabase
      .from('Affirmation_slaytion') // Use the new table 'Affirmation_slaytion'
      .select()
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
});

app.get('/scripta.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/scripta.js');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/affirmationNation.html');
});

server.listen(PORT, () => {
  console.log(`Servera is running on port ${PORT}`);
});

