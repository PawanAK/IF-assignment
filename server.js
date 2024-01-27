require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Use a default port if not specified

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connected to database')
        // listen to port
        app.listen(PORT, () => {
            console.log('listening for requests on port', PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })


// Middleware
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/community');
const roleRoutes = require('./routes/role');
const memberRoutes = require('./routes/member');

app.use('/v1/auth', authRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/role', roleRoutes);
app.use('/v1/member', memberRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
