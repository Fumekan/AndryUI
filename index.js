// Importujeme potřebné moduly
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
const axios = require("axios");
const fs = require('fs');

const triggerWords = ['andry', 'ANDRY','Andry', 'ph', 'PH', 'Ph', 'pH'];

// Load the responses from the JSON file
const data = fs.readFileSync('/root/AndryUI/responses.json', 'utf8');
const { responses } = JSON.parse(data);

client.on('messageCreate', async message => {
	// Loguji vstup
	var date=new Date();
	var s=date.getSeconds();
	var m=date.getMinutes();
	var h=date.getHours();
	var day=date.getDate();
	var month=date.getMonth()+1;
	var year=date.getFullYear();
	console.log(year + '/' + month + '/' + day + ' - ' + h + ':' + m + ':' + s + '|' + message.guild.name + '|' + message.channel.name + '|' + message.author.username + ': ' + message.content);


	// Ignore messages from other bots
	if (message.author.bot) return;
	if (!message.content.trim()) return;  // Ignore messages without content
	for (const word of triggerWords) {
		if (message.content.includes(word) || message.content.includes('@1158467740672208969')) {
        		const response = responses[Math.floor(Math.random() * responses.length)];
        		message.channel.send(response);
        		break;
    		} else {
			// Nothing
		}
	}
});

client.once('ready', () => {
    console.log('AndryUI is ready!');
});

client.login('TOKEN');
