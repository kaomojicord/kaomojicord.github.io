const profileSchema = require('../../schemas/profile.js')

module.exports = async (message, instance) => {
  if(message.author.bot) return;
  
  const config = {
    id: '1151845690650140703'
  }

  const role = message.mentions.roles.first()

  const isTriggered = (role) => role && role.id === config.id

  const res = isTriggered(role);

  if(!res) return;

  message.member.roles.add(role)

  const getProfileCard = (profileSchema, member) => profileSchema.findOne({ "user.id": member.id });

  let profileCard = await getProfileCard(profileSchema, message.author)

  if(!profileCard) return;

  profileCard.fooled = true

  return profileCard.save()
}