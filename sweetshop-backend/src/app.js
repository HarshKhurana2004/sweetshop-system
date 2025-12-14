require('./db/database');

const express = require('express');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const sweetsRoutes = require('./routes/sweets.routes');

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.get('/', (req, res) => {
  res.send('Sweet Shop Backend is running!');
});

module.exports = app;
