const { EmbedBuilder } = require('discord.js')

module.exports = async (member, instance) => {
  function staffEmbedCreate(memberName, memberIconURL) {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setDescription(`<:kaomojicels:1145350530592415784>   ${memberName} fled the mental asylum!\n<:connection:1146546428961890454>   no connection established`)
      .setFooter({ text: `${member.user.createdAt.toLocaleString()}`, iconURL: memberIconURL})
  }

  const staffPanel = instance.client.channels.cache.get('1146114513964380370')
  
  const memberName = member.nickname ? member.nickname : member.user.username 
    
  const memberIconURL = member.displayAvatarURL({ dynamic: true }) 

  await staffPanel.send({
    embeds: [staffEmbedCreate(memberName, memberIconURL)]
  })
}