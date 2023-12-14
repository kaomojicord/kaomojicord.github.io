const prepareProfileSchema = require('./events/guildMemberAdd/prepareProfileSchema.js')
const userJoinedSystem = require('./events/guildMemberAdd/user-joined-system.js')
const { Client, IntentsBitField, Partials, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const profileSchema = require('./schemas/profile.js')
const mongoose = require('mongoose');
const WOK = require('wokcommands');
const path = require("path");
require('dotenv/config')

/*
const minimodSchema = require('./schemas/minimoderators.js') 
const entry = new minimodSchema({ 
  user: {
    id: "283318267882242049"
  }, 
  timestamp: "1701546089" 
});
entry.save();*/

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers, 
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions
    
  ],
  partials: [
    Partials.Channel, 
    Partials.Message,
    Partials.Reaction
  ]
});

async function syncAll(guild, memberObject) {
  const filteredMemberObject = memberObject.filter(member => member.roles.cache.size < 2); 
  
  filteredMemberObject.forEach(async m => {
    const profileCard = await profileSchema.findOne({ "user.id": m.id })
    
    if(profileCard) return;
    
    prepareProfileSchema(m, client) 
    userJoinedSystem(m, client)
  })
}

async function notif(guild, memberObject) {
  const reminderEmbed = new EmbedBuilder()
  .setColor('#2C2F33')
  .setDescription(`** **\n<:bellbell:1154499066013687930> **__VERIFICATION REMINDER__**\n\nIn order to __pass__ the verification, **do** the following:\n\n- select your preferred kaomoji from the internet. ( e.g. try https://kaomoji.info/en/ )\n- use the built-in discord reply function & reply with your kaomoji to any previously sent embed featuring a 19-digit message ID.\n- an emote indicates whether your message has been successfully sent or not.\n- if no indicator is present, the bot is likely offline & you'll have to try again later.`)
  
  const filteredMemberObject2 = memberObject.filter(member => member.roles.cache.has('1151845690650140707') || member.roles.cache.size < 2); 
  
  const staffPanel = client.channels.cache.get('1146114513964380370')
  
  filteredMemberObject2.forEach(async m => {
    await m.send({
      embeds: [reminderEmbed]
    }).catch((err) => console.log(err.message))
  })
}

client.on("ready", async () => {
  const guild = client.guilds.cache.get('1151845690650140702')
  
  const memberObject = await guild.members.fetch()

  await mongoose.connect(process.env.MONGO_URI)
  
  await syncAll(guild, memberObject)
  
  //await notif(guild, memberObject)
  
  console.log("hi")
  
  /*
  const button = new ButtonBuilder()
		.setCustomId('button')
		.setEmoji('1148629326900764682')
		.setStyle(ButtonStyle.Danger);

	const row = new ActionRowBuilder()
		.addComponents(button);

	const c = client.channels.cache.get("1180100447051186271");
		
  c.send({
    content: `A button.`,
		components: [row],
	})*/
  
  new WOK({
    client, 
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, "features"),
    
    events: {
      dir: path.join(__dirname, "events"),
    }
  });
})

client.login(process.env.DISCORD_TOKEN)