import { createClient } from '@supabase/supabase-js';
const io = require('socket.io')(); // Import socket.io library

// Initialize Supabase client
const supabaseUrl = 'https://zfuccurwbaxbbodllptf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWNjdXJ3YmF4YmJvZGxscHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNTk4MzQsImV4cCI6MjAwODczNTgzNH0.EIfUECLq54zM2CGcFohwYemSi7UrMpDaPYx8woQcUWw';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event, context) {
  // Extract the socket.io instance from the context
  const socket = context.socket;

  // Parse the request body to get message details
  const { username, message, chatroom } = JSON.parse(event.body);

  // Insert the message into the Supabase database
  const { data, error } = await supabase
    .from('Chat_history')
    .insert([{ username, message, chatroom }]);

  if (error) {
    console.error('Error sending message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  } else {
    console.log('Message sent successfully');

    // Broadcast the message to all connected users in the chatroom
    socket.broadcast.to(chatroom).emit('chat message', { username, message });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully' }),
    };
  }
}
