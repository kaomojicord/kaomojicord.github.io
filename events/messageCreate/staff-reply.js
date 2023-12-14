const { EmbedBuilder } = require('discord.js')
const staffSchema = require('../../schemas/administrators.js') 

module.exports = async (message, instance) => {
  const config = {
    staffName: `The Elitist Superstructure`, 
    staffIconURL: `https://media.discordapp.net/attachments/1145300865213796495/1146566013991788614/tumblr_p86anjUznr1wpgehio1_400.jpg`
  } 

  const unembeddableFormat = [
    'video/mp4'
  ] 
  
  function emoteReact(message, isValid) {
    return isValid ? message.react('1146529074223775807').catch(() => {}) : message.react('1146529601254858882').catch(() => {})
  } 

  function embedCreate(name, iconURL, content, att) {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setAuthor({ name: name, iconURL: iconURL})
      .setDescription(`${content ? content : ``}\n<:connection:1146546428961890454>   ${message.id}`)
      .setImage(att ? att : null)
  }

  async function successfulRes() {
    let err
    if(message.content) {
      await referenceMessage.reply({
        embeds: [embedCreate(config.staffName, config.staffIconURL, message.content)]
      }).catch(() => {
        err = true
      })
    }

    if(err) return emoteReact(message, false)
    
    if(message.attachments.size) {
      message.attachments.forEach(async att => {
        const isUnembaddable = unembeddableFormat.includes(att.contentType)
        await referenceMessage.reply({
          embeds: [embedCreate(config.staffName, config.staffIconURL, null, isUnembaddable ? null : att.url)],
          files: isUnembaddable ? [{
            attachment: att.url,
            name: 'anon.png' 
          }] : null
        })
      })
    }  

    return emoteReact(message, true)
  }
  
  if(message.author.bot || message.channel.id !== '1146114513964380370') return;

  const staffObject = await staffSchema.find({})
    
  const staffArray = staffObject.map((i) => i.user.id)
  
  if(!staffArray.includes(message.author.id) || message.type !== 19 || (!message.content && !message.attachments.size)) return emoteReact(message, false)
  
  const referenceObject = await message.fetchReference()

  if(!referenceObject.embeds.length) return emoteReact(message, false) 
 
  const footerText = referenceObject.embeds[0].description?.split(' ').slice(-2)

  if(!footerText) return emoteReact(message, false);
  
  const referenceUserID = footerText[0]

  const referenceMessageID = footerText[1]

  const referenceMember = await instance.client.users.fetch(referenceUserID).catch(() => {})

  if(!referenceMember) return;
    
  await referenceMember.createDM()
  
  const authChannel = await instance.client.channels.cache.get('1168100368169836646')
  
  const authThread = await authChannel.threads.cache.get('1170816152658784447')
   
  const referenceMessage = await referenceMember.dmChannel.messages.fetch(referenceMessageID).catch(() => {}) || await authThread.messages.fetch(referenceMessageID).catch(() => {})
  
  if(!referenceMessage) return emoteReact(message, false)

  successfulRes()
};