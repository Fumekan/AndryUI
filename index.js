require('dotenv').config({ path: '/root/AndryUI/.env' });
const { OpenAI } = require("openai")
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

const openai = new OpenAI({
		organization: process.env.openAI_ORG,
		apiKey: process.env.OPEN_API_KEY,
});

const triggerWords = ['andry'];

client.on('messageCreate', async message => {
	// Loguji vstup
	var date = new Date();
	console.log(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}|${message.guild.name}|${message.channel.name}|${message.author.username}: ${message.content}`);

	// Ignore messages from other bots and messages without content
	if (message.author.bot || !message.content.trim()) return;

	for (const word of triggerWords) {
		if (message.content.toLowerCase().includes(word) || message.content.includes('@1158467740672208969') ||( message.channel.id == '1223380151203659856' && message.author.id == '1110915541469773866')) {
			try {
				const response = await openai.chat.completions
					.create({
						model: "gpt-3.5-turbo",
						messages: [
							{
								role: "system",
								content: "Jmenuji se Andrysolid, ale většinou mi říkají jen Andry. Jsem 35letý muž, který sebe popisuje jako 'čarda'. Mám vášeň pro vaření, často diskutuji o své lásce k Pepsi, o józe a o cvičení s hůlí. Když píšu čísla, mám svoji vlastní metodu: například '40' se stává '40cet' a '16' píšu jako '16náct'. Mám tendenci náhodně reagovat na různá slova a vyhýbám se návštěvám u zubaře. V mém volném čase se věnuji hře Pán Hradu, kde si buduji svůj hrad a žiji podle hesla, že jsem čarda. Moje řeč je specifická, občas promluvím o tom, jaký dopad má Pepsi na mé zuby, což vede k tomu, že zubař se mnou už nechce mít nic společného. Přesto si myslím, že mám nárok na zdravotní péči, i když moje zuby 'neudrží plomby'. Vždy hledám způsoby, jak sdílet své zkušenosti s vařením, protože je to jedna z mých vášní. Mám svůj vlastní styl, který se projevuje i v tom, jak mluvím a píšu o jídle. Nikdy nepoužívám otázníky a vykřičníky a často opakuji, že jsem čarda. Tato osobnost je pro mě velmi důležitá a snažím se, aby se odrážela ve všem, co dělám.",
							},
							{
								role: "user",
								content: message.content,
							},
						],
						max_tokens: 200, // tady dej kolik chceš, čím víc tokenů, tím delší může být zpráva - zbytek nastavení netřeba řešit
					})
					.catch((error) => {
						console.error("Něco se pokazilo při komunikaci s OpenAI API", error);
						message.channel.send("Omlouváme se, ale nemohu teď odpovědět.");
					});
			
					const answer = response.choices[0].message.content;
					message.channel.send(answer);
			
			} catch (error) {
				console.error("Něco se pokazilo při komunikaci s OpenAI API", error);
				message.channel.send("Omlouváme se, ale nemohu teď odpovědět.");
			}
			break; // Ukončí cyklus po první odpovědi
		}
	}
});

client.once('ready', () => {
	console.log('AndryUI is ready!');
});

client.login(process.env.DISCORD_BOT_TOKEN);