const { Client, MessageEmbed } = require("discord.js");
const Enmap = require("enmap");
const { stripIndents } = require("common-tags");
const config = require("./config.json");
const fs = require("fs");

require("dotenv").config();

const client = new Client({
    disableMentions: 'everyone',
    messageCacheMaxSize: 50,
    messageCacheLifetime: 60,
    messageSweepInterval: 120,
    partials: [
        'MESSAGE',
        'USER',
        'GUILD_MEMBER',
        'REACTION',
        'CHANNEL'
    ],
    ws: {
        intents: [
            'GUILDS',
            'GUILD_MEMBERS',
            'GUILD_PRESENCES',
            'GUILD_MESSAGES',
        ],
    }
});

client.settings = new Enmap({ name: "settings", fetchAll: false, autoFetch: true, cloneLevel: 'deep' });

client.on("ready", async () => {
    console.log(`Bot is now online on port ${process.env.PORT}!`);

    const webPortal = require("./server");
    webPortal.load(client);
});

client.on('message', async (message) => {

    client.settings.ensure(message.guild.id, {
        guildID: message.guild.id,
        prefix: "!"
    }); //You can add to this enmap. Such as more settings!

    const fetchedPrefix = client.settings.get(message.guild.id, "prefix");

    const prefix = fetchedPrefix || config.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    if (cmd === "prefix") {
        const curPrefix = client.settings.get(message.guild.id);

        const newPrefix = args[0];
        if (!newPrefix) return message.channel.send(`**Current Prefix: \`${curPrefix.prefix || config.prefix}\`**\nYou will need to specify a new prefix if you want to change it.`);

        if (newPrefix === curPrefix.prefix) return message.channel.send(`The bot's prefix is already set as that!`);

        client.settings.set(message.guild.id, newPrefix, "prefix");
        const prefixEmbed = new MessageEmbed()
            .setTitle(`**Bot Prefix**`)
            .setColor("RANDOM")
            .setDescription(stripIndents`
            Successfully set the prefix as: **\`${newPrefix}\`**
            `)

        return message.channel.send(prefixEmbed);
    };

    if (cmd === "ping") {
        const msg = await message.channel.send(`🏓 Pinging....`);
        msg.edit(`🏓 Pong!\nThe Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Latency is ${Math.round(client.ws.ping)}ms`);
    };

});


const prefix = config.prefix;

const credits = JSON.parse(fs.readFileSync('.credits.json'));
client.on('message', async message => {

client.settings.ensure(message.author.id, {
        userID: message.author.id,
        credits: "0"
    });
  
  if (message.author.bot || message.channel.type === 'dm') return;
  let args = message.content.split(' ');
  let author = message.author.id;
  if (!credits[author])
    credits[author] = {
      credits: 0
    };
  fs.writeFileSync('.credits.json', JSON.stringify(credits, null, 4));
  if (args[0].toLowerCase() == `${prefix}credits`) {
    const mention = message.mentions.users.first() || message.author;
    const mentionn = message.mentions.users.first();
    if (!args[2]) {
      message.channel.send(
        `**${mention.username}, :credit_card: account balance is  \`${credits[mention.id].credits}\`**`
      );
    } else if (mentionn && args[2]) {
      if (isNaN(args[2]) || [',', '.'].includes(args[2]))
        return message.channel.send(`**:x: | خطا **`);

      if (args[2] < 1) return message.channel.send(`**:x: | خطا**`);
      if (mention.bot) return message.channel.send(`**:x: | خطا**`);
      if (mentionn.id === message.author.id)
        return message.channel.send(`**:x: | خطا**`);
      if (args[2] > credits[author].credits)
        return message.channel.send(
          `:x: **-** هل رصيدك يكفي لهذا المبلغ؟`
        );
      if (args[2].includes('-')) return message.channel.send(`**:x: | خطا**`);
      let resulting =
        parseInt(args[2]) == 1
          ? parseInt(args[2])
          : Math.floor(args[2] - args[2] * (5 / 100));
      let tax =
        parseInt(args[2]) == 1
          ? parseInt(args[2])
          : Math.floor(args[2] * (5 / 100));
      let first = Math.floor(Math.random() * 9);
      let second = Math.floor(Math.random() * 9);
      let third = Math.floor(Math.random() * 9);
      let fourth = Math.floor(Math.random() * 9);
      let num = `${first}${second}${third}${fourth}`;
      let Canvas = require('canvas');
      let canvas = Canvas.createCanvas(108, 40);
      let ctx = canvas.getContext('2d');
      const background = await Canvas.loadImage(
        'https://cdn.discordapp.com/attachments/608278049091223552/617791172810899456/hmmm.png'
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = '20px Arial Bold';
      ctx.fontSize = '20px';
      ctx.fillStyle = '#ffffff';
      message.channel
        .send(
          `${
          message.author.username
          }, Transfer Fees: \`${tax}\`, Amount: \`$${resulting.toLocaleString()}\`
type these numbers to confirm: `
        )
        .then(async essss => {
          message.channel.send(`\`${num}\``).then(m => {
            message.channel
              .awaitMessages(r => r.author.id === message.author.id, {
                max: 1,
                time: 20000,
                errors: ['time']
              })
              .then(collected => {
                if (collected.first().content === num) {
                  essss.delete();
                  message.channel.send(
                    `**:moneybag: | ${
                    message.author.username
                    }, Done Transfeared \`$${resulting.toLocaleString()}\` To ${mentionn}**`
                  );
                  mention.send(
                    `**:money_with_wings: | Transfer Receipt **\`\`\`You Have Received \`$${resulting.toLocaleString()}\` From User ${
                    message.author.username
                    }; (ID (${message.author.id})\`\`\``
                  );
                  m.delete();
                  credits[author].credits += Math.floor(
                    -resulting.toLocaleString()
                  );
                  credits[mentionn.id].credits += Math.floor(
                    +resulting.toLocaleString()
                  );
                  fs.writeFileSync(
                    '.credits.json',
                    JSON.stringify(credits, null, 4)
                  );
                } else {
                  m.delete();
                  essss.delete();
                }
              });
          });
        });
    } else {
      message.channel.send(
        `**:x: | Error , Please Command True Ex: \`${prefix}credits [MentionUser] [Balance]\`**`
      );
    }
  }
});







client.login(process.env.token);