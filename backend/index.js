const express = require('express');
const cors = require('cors');
const {connectDB} = require('./config/db');
const {userRouter: authRouter} = require('./routes/auth.routes');
const {studentRouter} = require('./routes/students.routes');


const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

// Routes
 app.use('/api/auth', authRouter);
 app.use('/api/students', studentRouter);

// Start server
app.listen(8080, () => {
  connectDB();
  console.log('Server is running at http://localhost:8080');
});