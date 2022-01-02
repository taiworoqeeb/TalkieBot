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
const config = require('dotenv').config()
const fs = require('fs');
const path = require('path');
const download = require('download');



client.on('ready', (req, res) =>{
    const express = require('express');
    const app = express();
    const port = 3000;

    app.use("/public", express.static('public'));
    app.set('views', './views');
    app.set('view engine', 'ejs');


    app.get('/', (req, res) => {
      res.render('index', { text : client.user.tag});
      });
    app.listen(process.env.PORT || port, () => console.log(`${client.user.tag} listening at http://localhost:${port}`)); 
    console.log(`logged in as ${client.user.tag}!`)
    
    
});

function delay(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do{
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

client.on('messageCreate', async (message) => {

    if (message.guild && message.content.startsWith('/s-dm')) {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command')
        } else{
        let text = message.content.slice('/s-dm'.length);
        message.delete();
        message.guild.members.fetch().then(members =>{
            members.forEach(member => {
              const admin = member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
              const mod = member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES);
            if (member.id != client.user.id && !member.user.bot && !admin || !mod){
                member.send(text);
                }
            });
            });
        
        }
    }

 if (message.guild && message.content.startsWith('/d-dm')) {
        
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command')
        } else{
          let text = message.content.slice('/d-dm'.length);
            message.guild.members.fetch().then(members =>{
            message.delete();
            members.forEach(member => {
              const admin = member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
              const mod = member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES);
            if (member.id != client.user.id && !member.user.bot && !admin || !mod){
                member.send(text);
                delay(5000)
                }
            });
            });
        
        }
    }

    if(message.content.startsWith('/bot-avatar')){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command')
        } else{
            let url = message.content.slice('/bot-avatar'.length);
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
            message.author.send("New Bot's Avatar set, wait a few minutes for changes");   
        };

    };

    if(message.guild && message.content.startsWith('/bot-name')){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            return message.reply('You not permitted to use this command');
        } else{
            let botname = message.content.slice('/bot-name'.length);
            client.user.setUsername(botname);
            message.author.send(`Bot username changed to ${botname} NOTE: username can\'t be changed multiple times at the same time `);
            message.delete();
                }
            }
});

client.login(process.env.LOGIN_TOKEN)
