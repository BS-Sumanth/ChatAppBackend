const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const socketServer = require('./socketServer');
const authRoutes = require('./routes/authRoutes');
const friendInvitationRoutes = require('./routes/friendInvitationRoutes');

const PORT = process.env.PORT || process.env.API_PORT;
const app = express();
app.use(express.json());
app.use(cors());
/*app.use(cors(
    {
        origin: "https://chat-app-frontend-rosy.vercel.app",
        methods: ["POST", "GET"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"]
    }
));*/

app.use('/api/auth', authRoutes);
app.use('/api/friend-invitation', friendInvitationRoutes);
//app.use('/auth', authRoutes);
//app.use('/friend-invitation', friendInvitationRoutes);

const server = http.createServer(app);
socketServer.registerSocketServer(server);


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
        });
    })
    .catch(err => {
        console.log('Database connection failed. Server not started.');
        console.error(err);
    })