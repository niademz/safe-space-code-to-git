const AWS = require('aws-sdk');
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://zfuccurwbaxbbodllptf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWNjdXJ3YmF4YmJvZGxscHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNTk4MzQsImV4cCI6MjAwODczNTgzNH0.EIfUECLq54zM2CGcFohwYemSi7UrMpDaPYx8woQcUWw';
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    // Initialize a new WebSocket server
    const wss = new WebSocket.Server({ noServer: true });

    // Handle WebSocket connection events
    wss.on('connection', async (ws) => {
        console.log('Client connected');

        // Fetch chat history from Supabase and send to client
        try {
            const { data: messages, error } = await supabase
                .from('Chat_history')
                .select()
                .order('timestamp');

            if (error) {
                throw error;
            }

            ws.send(JSON.stringify(messages));
        } catch (error) {
            console.error('Error fetching chat history from Supabase:', error);
        }

        // Handle WebSocket message events
        ws.on('message', async (message) => {
            console.log('Received message:', message);

            // Store message in Supabase
            try {
                const { data, error } = await supabase
                    .from('Chat_history')
                    .insert([{ message_text: message, timestamp: new Date() }]);

                if (error) {
                    throw error;
                }
            } catch (error) {
                console.error('Error storing message in Supabase:', error);
            }

            // Broadcast message to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        // Handle WebSocket close events
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    // Upgrade HTTP request to WebSocket connection
    const response = {
        statusCode: 200,
        body: ''
    };

    return response;
};
