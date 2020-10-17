const express = require('express')
const fetch = require("node-fetch")
const Card = require('../models/card')
const router = new express.Router()
let url = "https://api.magicthegathering.io/v1/cards"

router.get('/cards', async (req, res) => {
  console.log("YOOOOO")
  try {
		if (!req.query.name){
			const dbCards = await Card.find({})
			res.send(dbCards)
			return
		}

    const dbCards = await Card.find({name: {$regex: req.query.name, $options: "i"}})
		if (dbCards.length){
			console.log(`Found ${dbCards.length} card, including ${dbCards[0].name}!`)
			res.send(dbCards)
		} else {
			console.log(`Searching API for ${req.query.name}...`)
			fetch(`${url}?name=${req.query.name}`)
			.then(r => {
				console.log("grabbed them! converting....")
				return r.json()
			})
			.then(async data => {
				console.log("found them!")
				let cards = data.cards.map(async c => {

					Card.findOne({name: c.name, manaCost: c.manaCost})
						.then(async duplicateCard => {
							if (duplicateCard){

								console.log(`${c.name} is already in the database`)
								return duplicateCard
							} else {

								const card = new Card(c)
								card.cardType = c.type

								console.log("Creating", card.name)

								await card.save()
								return card
							}

						})

				})

				res.send(cards)

			})
		}
  } catch (e){
    res.status(500).send(e)
  }
})

router.post('/cards', async (req, res) => {

	const card = new Card(req.body)
	card.cardType = req.body.type

	card.save().then(() => {
		res.send(card)
	}).catch(e => {
		debugger
	})

  console.log("hit")
})


module.exports = router
