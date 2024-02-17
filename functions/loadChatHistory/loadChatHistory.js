// Initialize Supabase client
const supabaseUrl = 'https://zfuccurwbaxbbodllptf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWNjdXJ3YmF4YmJvZGxscHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMxNTk4MzQsImV4cCI6MjAwODczNTgzNH0.EIfUECLq54zM2CGcFohwYemSi7UrMpDaPYx8woQcUWw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to load chat history for a specific chatroom
exports.handler = async (event) => {
  // Extract the chatroom name from the request path or query parameter
  const chatroom = event.queryStringParameters?.chatroom || event.path?.split('/')[1]; // Adjust based on your routing structure

  // Connect to Supabase using your credentials
  const { data, error } = await supabase
    .from('Chat_history')
    .select()
    .eq('chatroom', chatroom)
    .order('timestamp');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load chat history' }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ history: data }),
    };
  }
};