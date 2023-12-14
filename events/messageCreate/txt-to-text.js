const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async(m, instance) => {
  if(m.guildId !== '1151845690650140702') return;
  
  if(m.attachments.size === 0) return;
 
  if(m.attachments.first().contentType !== 'text/plain; charset=utf-8') return;
  
  const txt = await m.channel.send({
    content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ converting 。。。${m.url}`
  })
  
  const res = await fetch(m.attachments.first().url);
  
  if(!res.ok) {
    return txt.edit({
      content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ${res.statusText} ${m.url}`
    })
  }
  
  const text = await res.text();
  
  if(!text) return;
  
  console.log('txt has been converted succesfully');
 
  return txt.edit({
    content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ printed output! ${m.url}\n\n\`\`\`${text}\`\`\``,
  }).catch((err) => { 
    return txt.edit({ 
      content: `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 2K+ characters exceeded! ${m.url}`
    })
  })
}