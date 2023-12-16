const Discord = require("discord.js");

module.exports = async (m, instance) => {
  const auditChannel = instance.client.channels.cache.get('1180535755441967136')
   
  function audit(txt) {
    const auditChannel = instance.client.channels.cache.get('1180535755441967136')
    
    auditChannel.send({
      content: txt
    }).catch(err => {})
  }
  
  if(!m.author || m.guildId === '1151845690650140702') return;
  
  audit(`<:action:1148695755876470928> message by **<@${m.author.id}>** in **<#${m.channelId}>** was purged.\n- content: \`\`${m.content ? m.content : `null`}\`\`\n- first attachment: ${m.attachments.size > 0 ? `${m.attachments.first().proxyURL}` : `null`}`)
}