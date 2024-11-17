const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes'); // Your route handler file

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Attach Routes
app.use('/api', routes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
