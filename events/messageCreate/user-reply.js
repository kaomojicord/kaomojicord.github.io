const { EmbedBuilder } = require('discord.js')

module.exports = async (message, instance) => {
  /*
  function hasForbiddenRole() {
    const forbiddenRoles = ['1146075636717322310', '1146082541011472405']
    
    return forbiddenRoles.some(role => {
      member.roles.cache.has(role);
    }); 
  }
  */ 
 
  function emoteReact(message, isValid) {
    return isValid ? message.react('1146529074223775807') : message.react('1146529601254858882')
  } 

  function embedCreate(name, iconURL, message) {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setAuthor({ name: name, iconURL: iconURL})
      .setDescription(`${message.content} ${message.attachments.size ? `\`\`[attachment]\`\`` : ``}\n<:connection:1146546428961890454>   ${message.author.id} ${message.id}`)
  }  

  async function successfulRes() {
    await referenceMessage.reply({
      embeds: [embedCreate(memberName, memberIconURL, message)] 
    }) 
    return emoteReact(message, true)
  } 
  
  if(message.author.bot || message.channelId !== '1170816152658784447' && message.channel.type !== 1) return;

  const guild = await instance.client.guilds.cache.get('1151845690650140702')

  const member = await guild.members.fetch(message.author.id);

  /*
  const hasRole = hasForbiddenRole() 

  if(hasRole) return emoteReact(message, false)
  */
console.log("1")
  if(message.type !== 19 || !message.content && !message.attachments.size) return emoteReact(message, false)

  const staffPanel = instance.client.channels.cache.get('1146114513964380370')
  
  const memberName = member.nickname ? member.nickname : member.user.username 
  
  const memberIconURL = message.author.displayAvatarURL({ dynamic: true }) 

  const referenceObject = await message.fetchReference()
  
  if(referenceObject.embeds && !referenceObject.embeds[0]?.description) return;
  console.log("2")
  const footerText = referenceObject.embeds[0].description.split(' ').slice(-1)

  const referenceMessageID = footerText[0] 

  const referenceMessage = await staffPanel.messages.fetch(referenceMessageID).catch(() => {})

  if(!referenceMessage) return emoteReact(message, false)
  console.log("3")
  successfulRes()
}