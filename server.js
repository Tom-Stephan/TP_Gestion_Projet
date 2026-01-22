const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zero_dechets';

// Database Connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const clanRoutes = require('./routes/clans');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use('/api/clans', clanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
