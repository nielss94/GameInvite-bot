const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '!';

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if(msg.content === `${prefix}deletechannels`){
        msg.guild.channels.forEach(element => {
            if(element.type === 'voice') {
                if(element.members.array().length === 0){
                    element.delete();
                }
            }
        });
    }else if (msg.content === `${prefix}guildname`){
        msg.channel.send(msg.guild.name);
    }
});

client.login('NDM1MTA1OTcwMTg4ODQ1MDc2.DbUHlA.I7AatSicXivxx0t7xGvYCmuvhCg');

function createChannelAndInvite(){
    return new Promise((resolve, reject) => {
        client.guilds.array()[0].createChannel('newchannel'+Math.floor((Math.random() * 20)).toString(),'voice')
            .then((channel) => {
                channel.createInvite()
                    .then((invite) => {

                        console.log(`Created invite with code ${invite.url}`);
                        resolve(invite.url);         
                    })
                    .catch((err) => {
                        console.error();
                        reject(err);
                    })
            })
            .catch((err) => {
                console.error();
            });
    });
}

module.exports = {
    client,
    createChannelAndInvite
}