var express = require('express'),
    routes = express.Router();
var server = require('../server');
const dcClient = require('../bot/discordbot');


routes.get('/channelinvite', (req, res) => {
    dcClient.createChannelAndInvite()
        .then(url => {
            res.status(200).send(url);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

module.exports = routes;