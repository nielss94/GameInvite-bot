const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '!';

//1800000 is 30 minutes
const clearingInterval = 1800000;

client.on('ready', () => {
    console.log(`logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    const message = msg.content;

    if(message.toLowerCase() === `${prefix}deleteOODvoice`.toLowerCase()){
        clearOODVoiceChannels();
    }else if(message.toLowerCase() === `${prefix}deleteEmptyVoice`.toLowerCase()){
        deleteEmptyVoiceChannels();
    }
});

client.login(process.env.BOTTOKEN);

function createChannelAndInvite(game, cb){
    return new Promise((resolve, reject) => {
        client.guilds.array()[0].createChannel(game+'Game'+Math.floor((Math.random() * 20)).toString(),'voice')
            .then((channel) => {
                channel.setParent(client.guilds.array()[0].channels.array().find(ch => ch.name == 'Voice Channels'));
                channel.createInvite()
                    .then((invite) => {
                        console.log(`Created invite with code ${invite.url}`);
                        resolve({
                            url: invite.url,
                            channel: invite.channel.name
                        });         
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


function deleteEmptyVoiceChannels(){
    client.guilds.array()[0].channels.forEach(element => {
        if(element.type === 'voice') {
            console.log(`deleting - ${element.name} , created at: ${element.createdAt}`);
            if(element.members.array().length === 0){
                element.delete();
            }
        }
    });
}

function clearOODVoiceChannels() {
    let amount = 0;

    client.guilds.array()[0].channels.forEach(element => {
        if(element.type === 'voice') {
            if(element.members.array().length === 0){
                var today = new Date();
                
                var minutesDifference = Math.abs(today.getTime() -  element.createdTimestamp) / 1000 / 60;
                if(minutesDifference > 20){
                    console.log(`deleting - ${element.name} , created at: ${element.createdAt}`);
                    element.delete();
                    amount++;
                }
            }
        }
    });

    return amount;
}

//Delete unused out of time voice channels, every interval
setInterval(function() {
    console.log('Clearing voice channels that are out of date..');
    const amountDeleted = clearOODVoiceChannels();
    console.log(`Clearing finished. ${amountDeleted} channels deleted.`);
  }, clearingInterval);

module.exports = {
    client,
    createChannelAndInvite
}
