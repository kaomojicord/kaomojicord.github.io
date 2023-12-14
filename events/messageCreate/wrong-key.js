const { EmbedBuilder } = require('discord.js')

module.exports = async (message, instance) => {
  const config = {
    prefix: `⣵⡎⠑⡌⠩⢾⢨⠞⡫⣖⢗⠏⣴⡃⠓⡂`, 
    sign: '`𝘚𝘪𝘮𝘱𝘭𝘦𝘋𝘪𝘴𝘤𝘰𝘳𝘥𝘊𝘳𝘺𝘱𝘵`', 
    request: '1151845691342209064'
  }

  function embedCreate() {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setDescription(`** **\n<:action:1148695755876470928>   ${message.author} has selected the wrong key.\n\n<:pin:1146570163378978907>   Please ensure:\n- request a group key at <#${config.request}>.\n- optionally, rename it to your preference.\n- select the group key, and you're all set.`)
  }

  async function wrongKey() {
    await message.delete().catch(() => {})

    const notif = await message.channel.send({
      embeds: [embedCreate()]
    })
  }
  
  if(!message.content.includes(config.sign)) return;

  if(!message.content.includes(config.prefix)) return wrongKey();
} 
