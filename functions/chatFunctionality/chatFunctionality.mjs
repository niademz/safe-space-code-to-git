import { createClient } from '@supabase/supabase-js';

export async function handler(event, context) {
  // Initialize Supabase client
  const supabaseUrl = 'https://zfuccurwbaxbbodllptf.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWNjdXJ3YmF4YmJvZGxscHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNTk4MzQsImV4cCI6MjAwODczNTgzNH0.EIfUECLq54zM2CGcFohwYemSi7UrMpDaPYx8woQcUWw';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Parse request body
  const requestBody = JSON.parse(event.body);
  
  // Extract necessary data from the request
  const { chatroom, username, message } = requestBody;
  
  // Initialize response object
  let response;
  
  try {
    // Handle messages sent by clients
    // Broadcast the message to all connected clients in the same chatroom
    // Insert the message into the Supabase table
    const { data, error } = await supabase
      .from('Chat_history')
      .insert([
        {
          username: username,
          message_text: message,
          timestamp: new Date(),
          chatroom: chatroom,
        },
      ]);

    if (error) {
      console.error('Error inserting message into Supabase:', error);
      response = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    } else {
      console.log('Message inserted into Supabase:', data);
      response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message inserted into Supabase' }),
      };
    }
  } catch (error) {
    console.error('Error inserting message into Supabase:', error);
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
  
  // Return response
  return response;
}
