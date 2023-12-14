const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user: {
    id: String
  }, 
  timestamp: String
})

module.exports = mongoose.model('administrators', schema)