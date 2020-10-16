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
  },
	colors: {
		type: Array
	},
	colorIdentity: {
		type: Array
	},
	cardType: {
		type: String
	},
	supertypes: {
		type: Array
	},
	types: {
		type: Array
	},
	subtypes: {
		type: Array
	},
	rarity: {
		type: String
	},
	set: {
		type: String
	},
	setName: {
		type: String
	},
	text: {
		type: String
	},
	flavor: {
		type: String
	},
	artist: {
		type: String
	},
	number: {
		type: String
	},
	layout: {
		type: String
	},
	multiverseid: {
		type: Number
	},
	imageUrl: {
		type: String
	},
	power: {
		type: String
	},
	toughness: {
		type: String
	},
	loyalty: {
		type: String
	}
})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card
