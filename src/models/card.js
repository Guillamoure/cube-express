const mongoose = require('mongoose')
const validator = require('validator')

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  manaCost: {
    type: String,
    trim: true
  },
  cmc: {
    type: Number,
    trim: true
  }
})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card