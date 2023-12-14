const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionCollector } = require('discord.js') 

module.exports = async (message, instance) => {
  const config = {
    send: '1151385256734228500', 
    edit: '1151552593009573899', 
    staffName: `The Elitist Superstructure`, 
    staffIconURL: `https://media.discordapp.net/attachments/1145300865213796495/1146566013991788614/tumblr_p86anjUznr1wpgehio1_400.jpg`
  } 

  const res = {
    successSend: '** **\n<:information:1148724604957905047>  Successfully sent message.', 
    errSend: '** **\n<:information:1148724604957905047>  Message could not be sent.',
    channelSpecify: '** **\n<:action:1148695755876470928> Please specify a channel ID down below.', 
    messageSpecify: '** **\n<:action:1148695755876470928> Please specify a message ID down below.', 
    errEdit: '** **\n<:information:1148724604957905047>  Message could not be edited.', 
    successEdit: '** **\n<:information:1148724604957905047>  Successfully edited message.'
  }
  
  /*
  * general settings
  */

  if(message.author.bot) return;

  let channelId

  /*
  * components & embeds
  */

  function promptEmbed(text) {
    return new EmbedBuilder()
      .setDescription(text) 
      .setColor('#2C2F33')
  } 

  function sendButton(expired) {
      return new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('channel ID')
            .setCustomId('sendButton')
            .setStyle('Secondary')
            .setEmoji('1151442494568009728') 
            .setDisabled(!isNaN(expired)) 
        ) 
  } 

  function editButton(expired) {
    return new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('message ID')
            .setCustomId('editButton')
            .setStyle('Secondary')
            .setEmoji('1151442494568009728') 
            .setDisabled(!isNaN(expired)) 
        ) 
  }

  function channelModal() {
    return new ModalBuilder()
      .setCustomId('channelModal')
			.setTitle('Specify channel ID')
      .addComponents(  
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()           
          .setCustomId('channelField')
          .setLabel('channel ID')            
          .setStyle(TextInputStyle.Short)
          .setMinLength(18)
          .setMaxLength(19)
          .setPlaceholder('1151385256734228500')
          .setRequired(true),
        ),     
      ); 
  }

  function messageModal() {
    return new ModalBuilder()
      .setCustomId('messageModal')
			.setTitle('Specify message ID')
      .addComponents(  
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()           
          .setCustomId('messageField')
          .setLabel('message ID')            
          .setStyle(TextInputStyle.Short)
          .setMinLength(18)
          .setMaxLength(19)
          .setPlaceholder('1151388266044571723')
          .setRequired(true),
        ),     
      ); 
  }

  function embedTemplate(name, iconURL, message, att) {
    return new EmbedBuilder()
      .setColor('#2C2F33')
      .setAuthor({ name: name, iconURL: iconURL})
      .setDescription(message.content !== '' ? message.content : null)
      .setImage(att ? att.url : null) 
  }
    
  /*
  * functions
  */
  
  const isAppropriateChannel = () => message.channel.id === config.send || message.channel.id === config.edit 

  function channelModalHandler(i) {
    i.showModal(channelModal())
  }

  function messageModalHandler(i) {
    i.showModal(messageModal()) 
  }

  async function channelModalEval(i, mainSendMenu) {
    if(!i.deferred) await i.deferUpdate() 
    
    const id = i.fields.getTextInputValue('channelField')

    channel = await instance.client.channels.cache.get(id)
    
    if(!channel) return updateMainMenu(mainSendMenu, res.errSend)

    if(message.channel.id === '1151385256734228500') {
      sendMessage(channel, message)
    }

    if(message.channel.id === '1151552593009573899') {
      channelId = id
      
      updateMainMenu(mainSendMenu, res.messageSpecify) 
      
      mainSendMenu.edit({
        components: [
          sendButton(true), editButton()
        ]
      });
    }
  }

  async function messageModalEval(i) {
    if(!i.deferred) await i.deferUpdate() 

    const id = i.fields.getTextInputValue('messageField')

    const channel = instance.client.channels.cache.get(channelId)
    
    const embedMessage = await channel.messages.fetch(id).catch(() => {})

    if(!embedMessage) return updateMainMenu(mainSendMenu, res.errEdit)

    editMessage(embedMessage)
  }

  function updateMainMenu(mainSendMenu, text, expired, type) {
    let components 
    
    if(type === 'edit') {
      components = [
        sendButton(expired ? true : null), 
        editButton(expired ? true : null)
      ]  
    }

    if(!type) {
      components = [
        sendButton(expired ? true : null)
      ]
    }
    
    mainSendMenu.edit({
      embeds: text ? [
        EmbedBuilder.from(mainSendMenu).setDescription(text).setColor('#2C2F33')
      ] : null, 
      components: components
    });
  }

  async function sendMessage(channel, message) {
    const att = message.attachments.first()
 
    await channel.send({
      embeds: [embedTemplate(config.staffName, config.staffIconURL, message, att)]
    })
   
    return updateMainMenu(mainSendMenu, res.successSend) 
  }

  async function editMessage(embedMessage) {
    const att = message.attachments.first() 

    await embedMessage.edit({
      embeds: [
        embedTemplate(config.staffName, config.staffIconURL, message, att)
      ]
    })

    return updateMainMenu(mainSendMenu, res.successEdit, null, 'edit')
  }

  /*
  * main messages
  */

  let mainSendMenu
  
  if(isAppropriateChannel()) {
    mainSendMenu = await message.reply({
      embeds: [promptEmbed(res.channelSpecify)],
      components: [sendButton()],
    });
  }

  /*
  * collector settings
  */

  const collectorFilter = i => i.user.id === message.author.id;

  const channelFilter = i => i.type === 5;
 
  let sendMenuCollector

  if (mainSendMenu) {
    sendMenuCollector = mainSendMenu.createMessageComponentCollector({
      filter: collectorFilter,
      time: 120000
    })
  } 
  
  /*
  * collectors
  */
  if (mainSendMenu) {
    sendMenuCollector.on('collect', async i => {
      if(i.customId === 'sendButton') {
        channelModalHandler(i)

        updateMainMenu(mainSendMenu, null)
        
        const res = await i.awaitModalSubmit({  
          filter: channelFilter, 
          time: 120000
        }).catch((err) => console.log(err.message))

        if(i.message.id === res.message.id) channelModalEval(res, mainSendMenu)      
      } 

      if(i.customId === 'editButton') {
        messageModalHandler(i)

        updateMainMenu(mainSendMenu, null, null, 'edit')

        const res = await i.awaitModalSubmit({  
          filter: channelFilter, 
          time: 120000
        }).catch((err) => console.log(err.message))

        if(i.message.id === res.message.id) messageModalEval(res, mainSendMenu)
      }
    }) 

    sendMenuCollector.on('end', async () => {
      updateMainMenu(mainSendMenu, null, true, channelId ? 'edit' : null)
    }) 
  } 
}