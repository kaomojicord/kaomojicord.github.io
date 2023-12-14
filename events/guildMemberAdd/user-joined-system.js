const { EmbedBuilder } = require('discord.js')

module.exports = async (member, instance) => {
  let client

  instance.client ? client = instance.client : client = instance

  function userEmbedCreate(message) {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setDescription(`** **\n<:queue:1146569384614166528>   You have queued & therefore awaiting approval.\n\n<:pin:1146570163378978907>   Please keep the following in mind:\n- this process is technically an indefinite “ticket“ intended for verification.\n- the “elitists“ will review you based on the prerequisites in <#1168100368169836646>.\n- please follow the instruction sheet linked in said channel to avoid any further confusion.\n\n<:connection:1146546428961890454>   ${message.id}`)
  }

  function staffEmbedCreate(memberName, memberIconURL, memberMessage) {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setDescription(`<:kaomojicels:1145350530592415784>   ${memberName} wants to be accompanied!\n<:connection:1146546428961890454>   ${memberMessage ? member.user.id : `cannot send messages to this user`} ${memberMessage ? memberMessage.id : ``}`)
      .setFooter({ text: `${member.user.createdAt.toLocaleString()}`, iconURL: memberIconURL})
  }

  const staffPanel = client.channels.cache.get('1146114513964380370')
  
  const memberName = member.nickname ? member.nickname : member.user.username 
    
  const memberIconURL = member.displayAvatarURL({ dynamic: true }) 

  const referenceMessage = await staffPanel.send({
    embeds: [staffEmbedCreate(memberName, memberIconURL)]
  })
  
  const authChannel = await client.channels.cache.get('1168100368169836646')
  
  const authThread = await authChannel.threads.cache.get('1170816152658784447')
  
  member.send({
    embeds: [userEmbedCreate(referenceMessage)]
  }).then(async(memberMessage) => {
    await referenceMessageEdit(memberName, memberIconURL, memberMessage)
  }).catch((err) => {
    authThread.send({
      content: `${member.user}`,
      embeds: [userEmbedCreate(referenceMessage)]
    }).then(async(memberMessage) => {
      await referenceMessageEdit(memberName, memberIconURL, memberMessage)
      
      await authThread.members.add(member)
    }).catch((err) => {
      console.log(err.message)
    })
  })
  
  async function referenceMessageEdit(memberName, memberIconURL, memberMessage) {
    await referenceMessage.edit({
      embeds: [staffEmbedCreate(memberName, memberIconURL, memberMessage)] 
    }).catch(() => {})
  }
};