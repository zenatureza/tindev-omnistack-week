const express = require('express');

const routes = require('./routes');
// installed dependency
const mongoose = require('mongoose');
// installed dependency
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
// installed dependecy
// require('socket.io') returns a function with http server as parameter
// io therefore, becomes a server that listens http and also websockets!
const io = require('socket.io')(server);

const connectedUsers = {};

// when someones needs to connect to the server via websocket..
// with websockets we can make the backend alert the frontend when a match happens..
// in this way, the frontend does not need to make a ajax call to the server to check if
// there is a match (REAL TIME COMMUNICATION BIATCH)
io.on('connection', socket => {
    const { user } = socket.handshake.query;
    
    // makes a relation between user id with socket id 
    // connectedUsers is a dictionary with key as user id, and value is a websocket id related to the user
    connectedUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://zenatureza:root@cluster0-mirxp.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
})

// passes information to the controller through a middleware
app.use((req, res, next) => {
    // adds new inforation to the request variable (it will be accessible in the controller)
    // through the same variable name
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);


server.listen(3333);