const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');


module.exports = require('express')
module.exports = require('express-session')
module.exports = require('path')
module.exports = require('bcrypt')
module.exports = require('jsonwebtoken')


// Initialize Supabase client with your credentials
const SUPABASE_URL = 'https://dheotevevlxjyasdozkt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZW90ZXZldmx4anlhc2Rvemt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI5MjIwMTgsImV4cCI6MjAwODQ5ODAxOH0.-h4wA1lfhUWXe7ufj7kIVMLSwGdC8ZZUMoPQBOmBVYc';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware to parse request body as JSON
app.use(express.json());

// Session management
app.use(
  session({
    secret: 'Chinyere_is_a_slay', // Change this to a strong, random secret
    resave: false,
    saveUninitialized: false,
  })
);
// Serve static files from the root directory (e.g., HTML, CSS, images)
app.use(express.static(__dirname)); // __dirname is the directory where this script is located



// Route to handle user registration
app.post('/register', async (req, res) => {
  try {
    // Validate user input
    if (!req.body.Email || !req.body.Passwords || !req.body.Username) {
      return res.status(400).send('Email, username, and password are required');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.Passwords, 10);

    // Save user data to the 'Users' table in Supabase
    const { data, error } = await supabase.from('Users').upsert([
      {
        Email: req.body.Email,
        Username: req.body.Username,
        Passwords: hashedPassword,
      },
    ], { onConflict: ['Email'] });

    if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while registering the user');
    }

    // Set a session variable to indicate the user is logged in
    req.session.userId = data[0].id;

    // Send success response
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while registering the user');
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  try {
    // Validate user input
    if (!req.body.Username || !req.body.Passwords) {
      return res.status(400).send('Username and password are required');
    }

    // Retrieve user data from the 'Users' table in Supabase
    const { data: users, error } = await supabase
      .from('Users')
      .select()
      .eq('Username', req.body.Username)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while logging in the user');
    }

    if (!users || !(await bcrypt.compare(req.body.Passwords, users.Passwords))) {
      return res.status(401).send('Invalid username or password');
    }

    // Set a session variable to indicate the user is logged in
    req.session.userId = users.id;

    // Create and send user authentication token
    const token = jwt.sign({ userId: users.id }, 'chinyere_is_a_slay');
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while logging in the user');
  }
});

// Route to get the currently logged-in user's information
app.get('/profile', async (req, res) => {
  try {
    // Check if the user is authenticated by checking the session
    if (!req.session.userId) {
      return res.status(401).send('Not authenticated');
    }

    // Retrieve user information from the 'Users' table in Supabase
    const { data: user, error } = await supabase
      .from('Users')
      .select()
      .eq('id', req.session.userId)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('An error occurred while retrieving the user profile');
    }

    // Send the user's profile data
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while retrieving the user profile');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});