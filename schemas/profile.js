const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user: {
    id: String, 
    nickname: String, 
    joinedAt: String
  }, 
  power: Number, 
  fooled: Boolean
})

module.exports = mongoose.model('profile', schema)