const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dcClient = require('./bot/discordbot');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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

amountOfChats = 0;
io.on('connection', function (socket) {

    console.log('user connected');

    socket.on('send-message', function(data) {
        socket.to(data.chatRoom).emit('send-message', {
            local: false,
            message: data.message}
        );
    });

    socket.on("partysearch", function (data) {
        socket.join(data);
        console.log(io.nsps['/'].adapter.rooms[data]);
        let roomLength = io.nsps['/'].adapter.rooms[data].length;
        switch(data){
            case 'fortnite-duo':
                if(roomLength >= 2) {
                    foundParty(data);
                }
            break;
            case 'fortnite-squad':
                if(roomLength >= 4) {
                    foundParty(data);
                }
            break;
            case 'league-of-legends-sr-ranked':
                if(roomLength >= 5) {
                    foundParty(data);
                }
            break;
            case 'league-of-legends-sr-normal':
                if(roomLength >= 5) {
                    foundParty(data);
                }
            break;
            case 'league-of-legends-tt-ranked':
                if(roomLength >= 3) {
                    foundParty(data);
                }
            break;
            case 'league-of-legends-tt-normal':
                if(roomLength >= 3) {
                    foundParty(data);
                }
            break;
            case 'league-of-legends-aram':
                if(roomLength >= 5) {
                    foundParty(data);
                }
            break;
            case 'battlerite-2v2':
                if(roomLength >= 2) {
                    foundParty(data);
                }
            break;
            case 'battlerite-3v3':
                if(roomLength >= 3) {
                    foundParty(data);
                }
            break;
        }
    });

    socket.on('disconnect', function () {
        console.log(`${socket.id} disconnected`);
    });
});

function foundParty(game){
    dcClient.createChannelAndInvite(game)
    .then(invite => {
        let chatRoom = `${game}-chat-${++amountOfChats}`;
        io.to(game).emit("foundparty", {
            invite: invite,
            chatRoom: chatRoom
        });
        io.of('/').in(game).clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(game));
            socketIds.forEach(socketId => io.sockets.sockets[socketId].join(chatRoom));
        });
    })
    .catch(err => {
        console.log(err);
    });
}

server.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);    
});