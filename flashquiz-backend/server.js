const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const flashcardRoutes = require('./routes/flashcards');
app.use('/api/flashcards', flashcardRoutes);

app.listen(5000, () => console.log('Server started on port 5000'));
