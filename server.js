require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const authMiddleware = require('./middleware/authMiddleware'); // Import your authentication middleware
// const authRoutes = require('./routes/auth');
// const communityRoutes = require('./routes/community');
// const roleRoutes = require('./routes/role');
// const memberRoutes = require('./routes/member');

const app = express();
const PORT = process.env.PORT

// MongoDB connection setup


// Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/v1/auth', authRoutes);
// app.use('/v1/community', communityRoutes);
// app.use('/v1/role', roleRoutes);
// app.use('/v1/member', authMiddleware, memberRoutes); // Protect member routes with authentication middleware

// Start the server
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
