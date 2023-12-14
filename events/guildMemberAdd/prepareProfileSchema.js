const profileSchema = require('../../schemas/profile.js')

module.exports = async (member, instance) => {
  let client

  instance.client ? client = instance.client : client = instance

  async function createProfileCard() {
    await new profileSchema({
      user: {
        id: member.id, 
        nickname: member.nickname, 
        joinedAt: member.joinedAt
      }, 
      power: 0, 
      fooled: false
    }).save() 
  }

  async function reassignRole(power, nickname, isFooled) {
    const roleSelection = [
      { power: 1, id: '1151845690650140705' }, 
      { power: 2, id: '1151845690650140706' }, 
      { power: 3, id: '1151845690650140707' }, 
      { power: 4, id: '1151845690650140708' }, 
      { power: 5, id: '1151845690650140709' }, 
      { power: 6, id: '1151845690650140704' }, 
      { power: 8, id: '1184116712564604978' } //inactivity role
    ]

    const secondaryRoles = {
      fooled: '1151845690650140703'
    }

    const roleSelect = roleSelection.filter(i => i.power === power)

    const guild = await client.guilds.fetch('1151845690650140702') 

    const getRole = (id) => guild.roles.cache.get(id);

    if(getRole) member.roles.add(getRole(roleSelect[0].id))

    if(nickname) member.setNickname(nickname)

    if(isFooled) member.roles.add(getRole(secondaryRoles.fooled))
  }
  
  const profileCard = await profileSchema.findOne({ "user.id": member.id })

  if(!profileCard) return createProfileCard();

  const power = profileCard.power

  const nickname = profileCard.user.nickname

  const isFooled = profileCard.fooled

  if(power > 0) return reassignRole(power, nickname, isFooled)
};