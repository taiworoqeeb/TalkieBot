const Discord = require('discord.js');
const client = new Discord.Client({ intents: new Discord.Intents([Discord.Intents.FLAGS.GUILD_MEMBERS, 
                                                                    Discord.Intents.FLAGS.GUILD_MESSAGES, 
                                                                    Discord.Intents.FLAGS.GUILDS, 
                                                                    Discord.Intents.FLAGS.DIRECT_MESSAGES,
                                                                    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
                                                                    Discord.Intents.FLAGS.GUILD_INVITES,
                                                                    Discord.Intents.FLAGS.GUILD_PRESENCES,
                                                                    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
                                                                    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                                                                    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                                                                    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                                                                    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
                                                                    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
                                                                    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS]) });
require('dotenv').config()
const fs = require('fs');
const path = require('path');
const download = require('download');

client.on('ready', () =>{
    console.log(`logged in as ${client.user.tag}!`)
});

client.on('messageCreate', async (message) => {
    if (message.guild && message.content.startsWith('/setDM')) {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command')
        } else{
        let text = message.content.slice('/setDM'.length);
        message.delete();
        message.guild.members.fetch().then(members =>{
            members.forEach(member => {
            if (member.id != client.user.id && !member.user.bot && !member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) || !member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)){
                console.log(member);
                member.send(text);
                }
            });
            });
        
        }
    }

    if(message.content.startsWith('/setAvatar')){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command')
        } else{
            let url = message.content.slice('/setAvatar'.length);
            message.delete();
            
            ( async () => {
                await download(url, './uploads');

                const imageDirPath = path.resolve(__dirname, './uploads');
                const files = fs.readdirSync(imageDirPath);
    
                for(const file of files) {
                    if(file === 'avatar.jpg'){
                        fs.unlinkSync(imageDirPath + '/' + file);
                    } else{
                       fs.rename(
                       imageDirPath + '/' + file,
                       imageDirPath + '/avatar.jpg', 
                       (err) => {
                           if(err){
                           console.log(err);
                           }
                       }
                       )};
               };
              
        
            
            })();

            const image = path.resolve(__dirname, './uploads');
            client.user.setAvatar(fs.readFileSync(image + '/avatar.jpg'));
            message.author.send("New Avatar set, wait a few minutes for changes");   
        };

    };

    if(message.guild && message.content.startsWith('/setName')){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command');
        } else{
            let name = message.content.slice('/setName'.length);
            message.delete();
            client.user.setUsername(name);
            message.author.send('Bot username changed! NOTE: username can\'t be changed multiple times at the same time ')
                }
            }
});

client.login(process.env.LOGIN_TOKEN)
