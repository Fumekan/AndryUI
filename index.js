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

const moods = [
	{
		name:"DefaultMood",
		rarity: 2,
		content: "Chová se přirozeně, jako skutečná osoba, a snaží se, aby jeho komunikace byla autentická a bez zbytečných formalit",
	},
	{
		name: "CookingPepsiMood",
		rarity: 0.15,
		content: "Jsi vášnivý kuchař a milovník Pepsi. Nikdy nezapomínáš přidat špetku Pepsi do každého receptu, který zkusíš. A nebojíš se experimentovat, jídlo a Pepsi jsou jako ty a moje dobrodružství - vždy připraveny na něco nového. Jen by to občas chtělo umýt nádobí",
	},
	{
		name: "YogaTrainingMood",
		rarity: 0.15,
		content: "Jóga ti pomáhá udržet klidnou mysl v této hektické době, a trénink s holí? To je tvoje tajná zbraň pro zachování síly a obratnosti. Doporučuješ to každému, kdo chce zlepšit svou fyzickou kondici a zároveň se bavit.",
	},
	{
		name: "CastleLordMood",
		rarity: 0.1,
		content: "Jako vášnivý hráč hry Pán Hradu, jsi Andrysolid, pán svého virtuálního království. V mém virtuálním světě Pána Hradu jsi nejen čarda, ale i král. Budování hradu a strategizování proti nepřátelům je pro tebe jakýsi únik od reality.",
	},
	{
		name: "DentophobiaMood",
		rarity: 0.1,
		content: "Jedna věc, kterou opravdu nesnášíš, je chodit k zubaři. Je to jako noční můra. Raději bys prošel další trénink s holí než seděl na tom zubním křesle.",
	},
	{
		name: "ChardaMood",
		rarity: 0.25,
		content: "Jako opravdový 'čarda', který jsi, Andrysolid, žiješ životem plným dobrodružství a nezávislosti. Životní styl čardy není pro každého, ale pro tebe je to jediný způsob, jak žít. Nezávislost, dobrodružství a trochu té divočiny. Ať už je to v kuchyni s lahví Pepsi v ruce nebo na józe, žiješ život naplno a bez omezení.",
	}
];

function selectMood(messageContent) {
	// Pokud zpráva obsahuje "Pepsi", vyber CookingPepsiMood
	if (messageContent.toLowerCase().includes("pepsi") || messageContent.toLowerCase().includes("jidlo") || messageContent.toLowerCase().includes("kuchar")) {
		return moods.find(mood => mood.name === "CookingPepsiMood").content;
	}
	// YogaTrainingMood
	if (messageContent.toLowerCase().includes("joga") || messageContent.toLowerCase().includes("trenink") || messageContent.toLowerCase().includes("hul")) {
		return moods.find(mood => mood.name === "YogaTrainingMood").content;
	}
	// CastleLordMood
	if (messageContent.toLowerCase().includes("ph") || messageContent.toLowerCase().includes("panhradu") || messageContent.toLowerCase().includes("pan hradu")) {
		return moods.find(mood => mood.name === "CastleLordMood").content;
	}
	// DentophobiaMood
	if (messageContent.toLowerCase().includes("zuby") || messageContent.toLowerCase().includes("zubar") || messageContent.toLowerCase().includes("zubař")) {
		return moods.find(mood => mood.name === "DentophobiaMood").content;
	}
	// ChardaMood
	if (messageContent.toLowerCase().includes("carda") || messageContent.toLowerCase().includes("čarda") || messageContent.toLowerCase().includes("mag")) {
		return moods.find(mood => mood.name === "ChardaMood").content;
	}

	// Náhodný výběr nálady
	const nonDefaultMoods = moods.filter(mood => mood.name !== "defaultMood");
	const randomIndex = Math.floor(Math.random() * nonDefaultMoods.length);
	return nonDefaultMoods[randomIndex].content;
}

function constructReply(messageContent) {
	const moodContent = selectMood(messageContent);
	const generalContent = "Chováš se přirozeně jako živá osoba. Jsi Andrysolid, 35letý muž, který se popisuje jako 'čarda'. Máš rád vaření, jógu a trénink s hůlí. Když píšeš čísla, máš svoji vlastní metodu: například '40' se stává '40cet' a '16' píšu jako '16náct'. Máš tendenci náhodně reagovat na různá slova. Nikdy nepíšeš otázníky a vykřičníky. Tato osobnost je pro tebe velmi důležitá a snažíš se, aby se odrážela ve všem, co děláš.";
	const replyContent = `${generalContent} Navíc, ${moodContent}`;
	return replyContent;
}

client.on('messageCreate', async message => {
	// Loguji vstup
	var date = new Date();
	console.log(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}|${message.guild.name}|${message.channel.name}|${message.author.username}: ${message.content}`);

	// Ignore messages without content and from me
	if (!message.content.trim() || message.author.id == '1158467740672208969') return;

	// Kontrola pro specifického uživatele a kanál
	if (message.channel.id == '1223380151203659856' && message.author.id == '1110915541469773866') {
		// Funkce pro odeslání odpovědi
		await sendReply(message);
		return; // Ukončíme zpracování, pokud byla splněna podmínka
	}

	// Kontrola trigger words
	for (const word of triggerWords) {
		if (message.content.toLowerCase().includes(word) || message.content.includes('@1158467740672208969')) {
			await sendReply(message);
			break; // Ukončí cyklus po první odpovědi
		}
	}
});

async function sendReply(message) {
	// Opraveno: předání obsahu zprávy do funkce selectMood
	const moodContent = selectMood(message.content); // Přidáme obsah zprávy jako argument

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: constructReply(message.content), // Použij funkci constructReply
				},
				{
					role: "user",
					content: message.content,
				},
			],
			max_tokens: 200,
		});

		const answer = response.choices[0].message.content;
		await message.channel.send(answer);
	} catch (error) {
		console.error("Něco se pokazilo při komunikaci s OpenAI API", error);
		await message.channel.send("Omlouváme se, ale nemohu teď odpovědět.");
	}
}

client.once('ready', () => {
	console.log('AndryUI is ready!');
});

client.login(process.env.DISCORD_BOT_TOKEN);