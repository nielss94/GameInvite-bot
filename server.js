const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dcClient = require('./bot/discordbot');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var remove = require('lodash.remove');

var cors = require('cors');

var gameinviteRoutes = require('./api/gameinvite.routes');

var corsOptions = {
    origin: process.env.ALLOW_ORIGIN || '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: 'GET, POST, PUT, PATCH, DELETE'
}

//configure app
app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());

app.use('*', cors(corsOptions));

app.use('/api', gameinviteRoutes);

clients = [];
io.on('connection', function (socket) {

    
    console.log('user connected');

    socket.on("partysearch", function (data) {
        socket.join(data);
        console.log(data);
        console.log(io.nsps['/'].adapter.rooms[data]);
        let roomLength = io.nsps['/'].adapter.rooms[data].length;
        switch(data){
            case 'fortnite-duo':
                if(roomLength >= 2) {
                    dcClient.createChannelAndInvite(data)
                    .then(url => {
                        io.to(data).emit("foundparty", url);
                        io.of('/').in(data).clients((error, socketIds) => {
                            if (error) throw error;
                            socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data));
                        });
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
                }
            break;
            case 'fortnite-squad':
                if(roomLength >= 4) {
                    dcClient.createChannelAndInvite(data)
                    .then(url => {
                        io.to(data).emit("foundparty", url);
                        io.of('/').in(data).clients((error, socketIds) => {
                            if (error) throw error;
                            socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(data));
                        });
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
                }
            break;
        }
        
    });

    socket.on('disconnect', function () {
        console.log(`${socket.id} disconnected`);
    });
});

server.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);    
});