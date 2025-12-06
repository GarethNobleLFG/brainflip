const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();   //{ path: '../.env' } Use This For Local Dev.


const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;




// Allows Use Of Following Connections.
// Simple CORS override for debugging
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));







// Routes
try {
  const userRoutes = require('./routes/userRoutes');
  const cardRoutes = require('./routes/cardRoutes');
  const deckRoutes = require('./routes/deckRoutes');

  app.use('/api/users', userRoutes);
  app.use('/api/cards', cardRoutes);
  app.use('/api/decks', deckRoutes);

  console.log('Routes loaded successfully');
}
catch (error) {
  console.error('Error loading routes:', error);
}



// Root route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Flashcard API Server',
    status: 'Server is running!',
    port: PORT,
    endpoints: {
      health: '/health',
      users: '/api/users',
      cards: '/api/cards',
      decks: '/api/decks'
    }
  });
});




// Connect To MongoDB. 
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    })
    .then((mongoose) => {
      console.log("✅ Connected to MongoDB successfully");
      return mongoose;
    })
    .catch(err => {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    });
  }

  cached.conn = await cached.promise;

  // Drop index safely (runs only once per instance)
  try {
    await cached.conn.connection.db.collection("users").dropIndex("userID_1");
  } 
  catch (e) {
    // Doesn't Matter If It Doesn't Exist.
  }

  return cached.conn;

}




// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});





// For local development only
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}


module.exports = app;
