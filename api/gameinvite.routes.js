var express = require('express'),
    routes = express.Router();
var server = require('../server');
const dcClient = require('../bot/discordbot');


routes.post('/channelinvite', function(req, res) {
    var game = req.body.game;

    if(game){
        dcClient.createChannelAndInvite(game)
            .then(url => {
                res.status(200).send({
                    "url" : url
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