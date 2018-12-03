var express = require('express'),
    routes = express.Router();
const dcClient = require('../bot/discordbot');


routes.post('/channelinvite', function(req, res) {
    var game = req.body.game;

    if(game){
        dcClient.createChannelAndInvite(game)
            .then(invite => {
                res.status(200).send({
                    "url" : invite.url,
                    "channel" : invite.channel.name
                });
            })
            .catch(err => {
                res.status(400).send(err);
            });
    }else{
        res.status(400).json({
            message: 'No game specified'
        })
    }
});

module.exports = routes;