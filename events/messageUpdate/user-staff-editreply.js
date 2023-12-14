const { EmbedBuilder } = require('discord.js')

module.exports = async (oldMessage, newMessage, instance) => {
  async function successfulRes(isUser, channel) {
    const referenceMessageObject = await channel.messages.fetch({ limit: 5 })
    
    const referenceMessageMap = referenceMessageObject.filter((m) => m.author.bot && m.embeds[0].description.includes(newMessage.id))

    if(!referenceMessageMap.size) return;

    const referenceMessage = Array.from(referenceMessageMap.values()).pop()

    const referenceOldEmbed = referenceMessage.embeds[0] 

    const hasAttachment = referenceOldEmbed.description.includes(`[attachment]`)

    await referenceMessage.edit({
      embeds: [
        EmbedBuilder.from(referenceOldEmbed).setDescription(`${newMessage.content} ${hasAttachment ? `\`\`[attachment]\`\`` : ``}\n<:connection:1146546428961890454>   ${isUser ? newMessage.author.id : ``} ${newMessage.id}`)
      ]
    })
  }

  if(!newMessage) return;
  
  if((newMessage.author && newMessage.author.bot) || (newMessage.guild && newMessage.channel.id !== '1146114513964380370')) return;

  const referenceObject = await newMessage.fetchReference().catch(() => {})

  if(!referenceObject) return;
  
  if(referenceObject.embeds.length === 0) return;

  const footerText = referenceObject.embeds[0].description.split(' ').slice(-2)

  if(newMessage.channel.id == '1146114513964380370') {
    const referenceUserID = footerText[0] 
    
    const referenceMember = await instance.client.users.fetch(referenceUserID)

    await referenceMember.createDM()

    successfulRes(false, referenceMember.dmChannel)
  }

  if(!newMessage.guild) {
    const staffPanel = instance.client.channels.cache.get('1146114513964380370')

    successfulRes(true, staffPanel)
  }
} 