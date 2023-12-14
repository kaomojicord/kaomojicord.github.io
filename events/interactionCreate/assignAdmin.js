module.exports = async (i, instance) => {
  function audit(txt) {
    const auditChannel = instance.client.channels.cache.get('1180535755441967136')
    
    auditChannel.send({
      content: txt
    }).catch(err => {})
  }
  
  const staffArray = [
    '1178001207671926835',
    '1177699313787351190',
    '1172069889561853953',
    '840744851942932530'
  ]
  
  if(!i.isButton()) return;
  
  if(i.customId !== 'button') return;
  
  await i.deferUpdate()
  
  if(!staffArray.includes(i.user.id)) return;
  
  const guild = await instance.client.guilds.fetch('1151845690650140702') 
 
  const role = guild.roles.cache.get('1162838389578535033');
  
  const member = guild.members.cache.get(i.user.id);
  
  if(member.roles.cache.has('1162838389578535033')) {
    member.roles.remove(role)
    audit(`<:moderation:1148629326900764682> **<@${member.user.id}>** disabled administrator privileges.`)
  } else {
    member.roles.add(role)
    audit(`<:moderation:1148629326900764682> **<@${member.user.id}>** enabled administrator privileges.`)
  }
}