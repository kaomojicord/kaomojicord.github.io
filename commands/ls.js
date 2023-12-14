const { CommandType } = require("wokcommands");
const { InteractionCollector, EmbedBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, ComponentType, TextInputBuilder, TextInputStyle } = require('discord.js')
const profileSchema = require('../schemas/profile.js')

module.exports = {
  type: CommandType.legacy,
  callback: async ({ client, message, guild }) => {
    const config = {
      perPage: 10, 
      staffChannelId: '1151845691342209066'
    }
    
    /*
    * general settings
    */

    const profileList = await profileSchema.find({})
    let index = 0
    let userObject

    /*
    * components & embeds
    */

    function mainEmbed() {
      return new EmbedBuilder()
        .setDescription(`** **\n<:menu:1148542094424670208> A selection of user options can be found below.`) 
        .setColor('#2C2F33') 
    }

    function mainStaffEmbed() {
      return new EmbedBuilder()
        .setDescription(`** **\n<:menu:1148542094424670208> A selection of staff options can be found below.`) 
        .setColor('#2C2F33') 
    }

    function selectMenu(expired, selectedValue) {
      const values = ['board']
      const isSelected = (a, b) => a === b

      return new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('selectMenu')
            .setPlaceholder('Open Panel')
           
            .addOptions(
              {
                label: 'Kaomojicels Lookup',
                value: values[0],
                default: isSelected(values[0], selectedValue) ? true : false,
                emoji: '1145350530592415784'
              },
            )
            .setDisabled(!isNaN(expired))
            .setMinValues(1)
            .setMaxValues(1)
        )
    }

    function selectButtons(index, display, expired) {
      const profileListFiltered = profileList.filter(i => i.power > 3)
      
      return new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('left')
            .setStyle('Secondary')
            .setEmoji('1145353129689358416')
            .setDisabled(index === 0 || expired === Number || !isNaN(expired))
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId('right')
            .setStyle('Secondary')
            .setEmoji('1145352790848319568')
            .setDisabled(index + config.perPage > profileListFiltered.length || index + display === profileListFiltered.length || !isNaN(expired))
        )
    }

    function kaomojiEmbed(a) {
      const profileListFiltered = profileList.filter(i => i.power > 3)
      const currentRow = profileListFiltered.slice(a, a + config.perPage)
      const currentKaomojicels = currentRow.map((i) => `${i.user.nickname}`).join('\n')
      const currentPage = a / 10 + 1
      const totalPages = Math.floor(profileListFiltered.length / config.perPage + 1)
      const currentLowestItem = 1 + (a > 0 ? a : 0)
      const currentHighestItem = currentRow.length + a
      const totalItems = profileListFiltered.length

      return new EmbedBuilder()
        .setDescription(`${currentKaomojicels}\n\n<:index:1145373318246039793>   showing ${currentLowestItem} - ${currentHighestItem} of ${totalItems}  •  page ${currentPage} of ${totalPages}`)
        .setColor('#2C2F33')
        .setAuthor({ name: '‎  ' })
    }

    function selectStaffMenu(expired, selectedValue) {
      const values = ['moderate user']
      const isSelected = (a, b) => a === b

      return new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('selectStaffMenu')
            .setPlaceholder('Open Panel')
            .addOptions(
              {
                label: 'User Moderation',
                value: values[0],
                default: isSelected(values[0], selectedValue) ? true : false,
                emoji: '1148629326900764682'
              },
            )
            .setDisabled(!isNaN(expired))
            .setMinValues(1)
            .setMaxValues(1)
        )
    } 

    function userSelectEmbed() {
      return new EmbedBuilder()
        .setDescription(`** **\n<:at:1148644780318924921> Please select an user from the dropdown below.`)
        .setColor('#2C2F33')
    }

    function userSelect(expired) {  
      return new ActionRowBuilder()
        .addComponents(      
          new UserSelectMenuBuilder()
          .setCustomId('userSelect')
          .setPlaceholder('User Dropdown')
          .setDisabled(!isNaN(expired))
          .setMinValues(1)
          .setMaxValues(1)
        )
    }

    function userSelectOptionEmbed() {
      return new EmbedBuilder()
        .setDescription(`** **\n<:action:1148695755876470928> Please select a specific action down below.`)
        .setColor('#2C2F33')
    }

    async function userOption(expired, selectedValue, userObject) {
      const values = ['verify user', 'integrate user', 'retrofit user', 'low quality user', 'omega low quality user', 'deport user']
      const isSelected = (a, b) => a === b

      let isEligibleProbation, isEligibleIntegration, isEligibleRetrofit, isEligibleLQ, isEligibleOLQ, isEligibleDeport
        
      if(userObject) {
        isEligibleProbation = await evaluateUser(userObject, values[0]) 
        isEligibleIntegration = await evaluateUser(userObject, values[1])
        isEligibleRetrofit = await evaluateUser(userObject, values[2])
        isEligibleLQ = await evaluateUser(userObject, values[3])
        isEligibleOLQ = await evaluateUser(userObject, values[4])
        isEligibleDeport = await evaluateUser(userObject, values[5])
      } 

      return new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('userOption')
            .setPlaceholder('Select Action')
            .addOptions(
              {
                label: 'Retrofit User', 
                description: isEligibleRetrofit ? 'Available' : 'Not Available', 
                value: values[2], 
                default: isSelected(values[2], selectedValue) ? true : false,
                emoji: '1149413797728108648'
              }, 
              {
                label: 'Integrate As Kaomojicel', 
                description: isEligibleIntegration ? 'Available' : 'Not Available', 
                value: values[1], 
                default: isSelected(values[1], selectedValue) ? true : false,
                emoji: '1149002632124432404' 
              }, 
              {
                label: 'Put On Probation',
                description: isEligibleProbation ? 'Available' : 'Not Available', 
                value: values[0],
                default: isSelected(values[0], selectedValue) ? true : false,
                emoji: '1148703501468307527'
              }, 
              {
                label: 'Set Low Quality', 
                description: isEligibleLQ ? 'Available' : 'Not Available', 
                value: values[3],
                default: isSelected(values[3], selectedValue) ? true : false, 
                emoji: '1150857704823328799'
              }, 
              {
                label: 'Set Omega Low Quality',
                description: isEligibleOLQ ? 'Available' : 'Not Available', 
                value: values[4],
                default: isSelected(values[4], selectedValue) ? true : false, 
                emoji: '1151045302313304074' 
              },
              {
                label: 'Deport User',
                description: isEligibleDeport ? 'Available' : 'Not Available', 
                value: values[5],
                default: isSelected(values[5], selectedValue) ? true : false, 
                emoji: '1148695755876470928' 
              }
            )
            .setDisabled(!isNaN(expired))
            .setMinValues(1)
            .setMaxValues(1)
        )
    }

    function userActionEmbed(success) {
      return new EmbedBuilder()
        .setDescription(`** **\n<:information:1148724604957905047> ${success ? ` Successfully taken action.` : ` Action was unsuccessful.`}`)
        .setColor('#2C2F33')
    }

    function nicknameModal() {
      return new ModalBuilder()
        .setCustomId('nicknameModal')
			  .setTitle('Integrate As Kaomojicel')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('nicknameField')
              .setLabel('Set Kaomojicel Nickname')
              .setStyle(TextInputStyle.Short)
              .setMinLength(3)
              .setMaxLength(32)
              .setPlaceholder('( ・∀・)・・・--------☆')
              .setRequired(true),
          ),
        );
    }

    /*
    * functions
    */
    
    const getMember = (user) => guild.members.cache.get(user.id);

    const getProfileCard = (profileSchema, user) => profileSchema.findOne({ "user.id": user.id });
      
    async function evaluateUser(user, selectedValue) {
      const member = await getMember(user);

      if(!member) return;

      const profileCard = await getProfileCard(profileSchema, user)
      
      if(!profileCard) return;

      if(selectedValue === 'verify user' && profileCard.power !== 0) return;

      if(selectedValue === 'integrate user' && (profileCard.power !== 3 && profileCard.power !== 2)) return;

      if(selectedValue === 'retrofit user' && profileCard.power !== 4) return;

      if(selectedValue === 'low quality user' && profileCard.power !== 4 && profileCard.power !== 5 && profileCard.power !== 1) return;

      if(selectedValue === 'omega low quality user' && (profileCard.power === 0 || profileCard.power === 1)) return;
      
      if(selectedValue === 'deport user' && profileCard.power === 0) return;

      return member;
    };

    async function manageUser(user, selectedValue) {
      const res = await evaluateUser(user, selectedValue)

      if(!res) return;
        
      const member = await getMember(user);

      let profileCard = await getProfileCard(profileSchema, user)

      const entries = {
        'omega low quality user': ['1151845690650140705', '1'], 
        'low quality user': ['1151845690650140706', '2'], 
        'verify user': ['1151845690650140707', '3'], 
        'integrate user': ['1151845690650140708', '4'], 
        'retrofit user': ['1151845690650140709', '5'],
        'deport user': ['1184116712564604978', '8']
      } 

      const getRole = id => guild.roles.cache.get(id)

      const roleSelection = [
        '1151845690650140705', 
        '1151845690650140706', 
        '1151845690650140707', 
        '1151845690650140708', 
        '1151845690650140709', 
        '1184116712564604978'
        //'1151845690650140704', 
      ]

      const userRoles = member.roles.cache.map(r => r.id).slice(0, -1)
    
      const badRoles = userRoles.filter(i => roleSelection.includes(i));

      await member.roles.remove(badRoles) 

      console.log(selectedValue)

      const role = getRole(entries[selectedValue][0])

      await member.roles.add(role)

      const power = entries[selectedValue][1]

      profileCard.power = power

      await profileCard.save()
  
      return true;
    }

    async function nicknameUser(member, nickname) {
      member.setNickname(nickname)

      let profileCard = await getProfileCard(profileSchema, member)

      profileCard.user.nickname = nickname

      await profileCard.save()

      return;
    }

    async function modalHandler(i, user) {
      const member = await getMember(user);

      if(!member) return; 

      const profileCard = await getProfileCard(profileSchema, member)

      if(!profileCard.user.nickname) return i.showModal(nicknameModal())

      await nicknameUser(member, profileCard.user.nickname)
 
      const success = await manageUser(userObject, 'integrate user')
    
      await i.deferUpdate().catch(() => {})
      
      return mainStaffMenu
      .edit({
        embeds: [userActionEmbed(success)],
        components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, 'integrate user', user)], 
      })
      .catch(() => {})
    }

    const collectorResetTimer = async (collector) => await collector.resetTimer()
    
    /*
    * main messages
    */

    let mainMenu, mainStaffMenu

    if (guild && message.channel.id !== config.staffChannelId) {
      mainMenu = await message
      .reply({
        embeds: [mainEmbed()],
        components: [selectMenu()],
      })
      .catch(() => {})
    }

    if (message.channel.id === config.staffChannelId) {
      mainStaffMenu = await message
      .reply({
        embeds: [mainStaffEmbed()],
        components: [selectStaffMenu()]
      })
      .catch(() => {})
    }

    /*
    * collector settings
    */

    const collectorFilter = i => i.user.id === message.author.id;

    const nicknameFilter = i => i.type === 5 && i.message.id === mainStaffMenu.id;
    
    let selectMenuCollector, selectButtonsCollector, selectStaffMenuCollector, selectUserCollector, selectOptionCollector, nicknameCollector

    if (mainMenu) {
      selectMenuCollector = selectButtonsCollector = mainMenu.createMessageComponentCollector({
        filter: collectorFilter,
        time: 1000 * 60 * 15
      })
    }

    if (mainStaffMenu) {
      selectStaffMenuCollector = selectOptionCollector = mainStaffMenu.createMessageComponentCollector({
        componentType: ComponentType.StringSelect, 
        filter: collectorFilter,
        time: 1000 * 60 * 15
      })

      selectUserCollector = mainStaffMenu.createMessageComponentCollector({
        componentType: ComponentType.UserSelect, 
        filter: collectorFilter, 
        time: 1000 * 60 * 15
      }) 

      nicknameCollector = new InteractionCollector(client, {
        filter: nicknameFilter, 
        time: 1000 * 60 * 15
      }); 
    }

    let selectedMenu, selectedStaffMenu, selectedAction

    /*
    * collectors
    */

    if (mainMenu) {
      selectMenuCollector.on('collect', async i => {
        if (!i.values) return;

        selectedMenu = i.values[0]

        collectorResetTimer(selectMenuCollector)
        
        mainMenu
        .edit({
          embeds: [kaomojiEmbed(index)],
          components: [selectMenu(undefined, selectedMenu), selectButtons(index, config.perPage)]
        })
        .catch(() => {})
      })

      selectMenuCollector.on('end', async () => {
        if (selectedMenu) return;

        mainMenu
        .edit({
          components: [selectMenu(true)]
        })
        .catch(() => {})
      })

      selectButtonsCollector.on('collect', async i => {
        function refreshEmbed() {
          mainMenu
          .edit({
            embeds: [kaomojiEmbed(index)],
            components: [selectMenu(undefined, selectedMenu), selectButtons(index, config.perPage)]
          })
          .catch(() => {})
        } 
        
        await i.deferUpdate().catch(() => {})

        collectorResetTimer(selectMenuCollector)

        if (i.customId === 'left' && index > 0) {
          index -= config.perPage
          refreshEmbed()
        };

        if (i.customId === 'right' && index + 10 < profileList.length) {
          index += config.perPage
          refreshEmbed()
        };
      });

      selectButtonsCollector.on('end', async () => {
        if (!selectedMenu) return;

        mainMenu
        .edit({
          embeds: [kaomojiEmbed(index)],
          components: [selectMenu(true, selectedMenu), selectButtons(index, config.perPage, true)]
        })
        .catch(() => {})
      })
    }

    if (mainStaffMenu) {
      selectStaffMenuCollector.once('collect', async i => {
        if (!i.values) return;

        await i.deferUpdate().catch(() => {})

        selectedStaffMenu = i.values[0]

        mainStaffMenu
        .edit({
          embeds: [userSelectEmbed()],
          components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect()]
        })
        .catch(() => {})
      })

      selectStaffMenuCollector.on('end', async i => {
        if (selectedStaffMenu) return;

        mainStaffMenu
        .edit({
          components: [selectStaffMenu(true)]
        })
        .catch(() => {})
      })

      selectUserCollector.on('collect', async i => {
        userObject = i.users.values().next().value

        await i.deferUpdate().catch(() => {})

        mainStaffMenu
        .edit({
          embeds: [userSelectOptionEmbed()],
          components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, null, userObject)], 
        })
        .catch(() => {})
      })
        
      selectUserCollector.on('end', async i => {
        if(!selectedStaffMenu || userObject) return;
        
        mainStaffMenu
        .edit({
          components: [selectStaffMenu(true, selectedStaffMenu), userSelect(true)], 
        })
        .catch(() => {})
      })

      selectOptionCollector.on('collect', async i => {
        selectedAction = i.values[0]

        collectorResetTimer(selectOptionCollector)

        if(i.values[0] === 'verify user') {
          const success = await manageUser(userObject, i.values[0])

          await i.deferUpdate().catch(() => {})
          
          mainStaffMenu
          .edit({
            embeds: [userActionEmbed(success)],
            components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, i.values[0], userObject)], 
          })
          .catch(() => {})
        }

        if(i.values[0] === 'integrate user') {
          modalHandler(i, userObject)
        }

        if(i.values[0] === 'retrofit user') {
          const success = await manageUser(userObject, i.values[0])

          await i.deferUpdate().catch(() => {})
          
          mainStaffMenu
          .edit({
            embeds: [userActionEmbed(success)],
            components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, i.values[0], userObject)], 
          })
          .catch(() => {})
        }

        if(i.values[0] === 'low quality user' || i.values[0] === 'omega low quality user') {
          const success = await manageUser(userObject, i.values[0])

          await i.deferUpdate().catch(() => {})
          
          mainStaffMenu
          .edit({
            embeds: [userActionEmbed(success)],
            components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, i.values[0], userObject)], 
          })
          .catch(() => {})
        }
        
        if(i.values[0] === 'deport user') {
          const success = await manageUser(userObject, i.values[0])

          await i.deferUpdate().catch(() => {})
          
          mainStaffMenu
          .edit({
            embeds: [userActionEmbed(success)],
            components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, i.values[0], userObject)], 
          })
          .catch(() => {})
        }
      }) 

      selectOptionCollector.on('end', async i => {
        if(!userObject) return;
        
        mainStaffMenu
        .edit({
          components: [selectStaffMenu(true, selectedStaffMenu), userSelect(true), await userOption(true, selectedAction)], 
        })
        .catch(() => {})
      })
  
      nicknameCollector.on('collect', async i => {
        await i.deferUpdate().catch(() => {})
        
        const success = await manageUser(userObject, 'integrate user')

        const member = getMember(userObject) 

        const nickname = i.fields.getTextInputValue('nicknameField') 
        
        if(success) nicknameUser(member, nickname) 

        mainStaffMenu
        .edit({
          embeds: [userActionEmbed(success)],
          components: [selectStaffMenu(undefined, selectedStaffMenu), userSelect(), await userOption(undefined, 'integrate user', userObject)], 
        })
        .catch(() => {})
      }) 
    }
  }
}