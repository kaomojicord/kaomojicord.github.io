const staffSchema = require('../../schemas/administrators.js') 
const minimodSchema = require('../../schemas/minimoderators.js') 

module.exports = async (r, user, instance) => {
  function audit(txt) {
    const auditChannel = instance.client.channels.cache.get('1180535755441967136')
    
    auditChannel.send({
      content: txt
    }).catch(err => {})
  }
  
  if(r.message.guildId !== '1151845690650140702') return;
  
  if(r._emoji.id !== '1180560633750618152') return;
  
  const pinnedCollection = await r.message.channel.messages.fetchPinned()
  
  const isPinned = pinnedCollection.some(m => m.id === r.message.id)
  
  if(isPinned) return;
  
  const m = await r.message.channel.messages.fetch(r.message.id)
  
  const staffObject = await staffSchema.find({})
    
  const staffArray = staffObject.map((i) => i.user.id)
  
  if(staffArray.includes(m.author.id)) return;
  
  const minimodObject = await minimodSchema.find({})
    
  const minimodArray = minimodObject.map((i) => i.user.id)
  
  if(!minimodArray.includes(user.id)) return;
  
  await m.delete().catch(err => console.log(err))
  
  audit(`<:action:1148695755876470928> **<@${user.id}>** purged a message sent by <@${m.author.id}> in **<#${m.channelId}>**.`)
}