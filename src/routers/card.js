const express = require('express')
const fetch = require("node-fetch")
const Card = require('../models/card')
const router = new express.Router()
let url = "https://api.magicthegathering.io/v1/cards"
let scryfallCardsMultiverse = "https://api.scryfall.com/cards/multiverse"

router.get('/cards', async (req, res) => {
  console.log("YOOOOO")
  try {
		if (!Object.keys(req.query).length){
			const dbCards = await Card.find({})
			res.send(dbCards)
			return
		}

    const dbCards = await Card.find({name: {$regex: req.query.name || "", $options: "i"}, set: {$regex: req.query.set || "", $options: "i"}})
		// const dbCards = []
		if (dbCards.length){
			console.log(`Found ${dbCards.length} card, including ${dbCards[0].name}!`)
			res.send(dbCards)
		} else {
			console.log(`Searching API for ${req.query.name || req.query.set}...`)
			let query = ""
			Object.keys(req.query).forEach(q => {
				query += query.length > 0 ? "&" : "?"
				query += `${q}=${req.query[q]}`
			})
			let totalSearch = false
			let page = 1
			let apiCards = []
			while (!totalSearch){
				let pageQuery = query.length > 0 ? "&" : "?"
				pageQuery += `page=${page}`
				console.log("fetch to", `${url}${query}${pageQuery}`)

				const response = await fetch(`${url}${query}${pageQuery}`)
				const json = await response.json()

				apiCards = [...apiCards, ...json.cards]
				if (json.cards.length < 100){
					totalSearch = true
				}
				page++
			}
			// fetch(`${url}${query}`)
			// .then(r => {
			// 	console.log("grabbed them! converting....")
			// 	return r.json()
			// })
			console.log("found them!")

			let uniqueCardNames = []
			let basicLandNames = ["Forest", "Mountain", "Island", "Swamp", 'Plains']
			let uniqueAndValidCards = apiCards.filter((el, i, array) => {
				if (el.multiverseid){
					if (!uniqueCardNames.includes(el.name) || basicLandNames.includes(el.name)){
						uniqueCardNames.push(el.name)
						return true
					} else {
						return false
					}
				} else {
					return false
				}
			})
			console.log("unique cards created, except for basic lands")
				// console.log(uniqueAndValidCards)
				let cards = uniqueAndValidCards.map(c => {
					const card = new Card(c)
					card.cardType = c.type
					return card
				})
				// current code creates a formatted card, and sends that data
				// the below code will check for duplicates that already exist, then create a card
				// the below code does not wait to return the searched card, it will return an empty object
				// not sure how to link async/await to wait for database look up and/or save to send that data to the frontend


				let saveCards = await uniqueAndValidCards.map(async c => {
					let dbCard = {foo: "bar"}
					let searchCriteria = {name: c.name, manaCost: c.manaCost}
					if (basicLandNames.includes(c.name)){
						searchCriteria = {multiverseid: c.multiverseid}
					}
					Card.findOne(searchCriteria, async (err, existingCard) => {
						if (existingCard){
							console.log(`${c.name} is already in the database`)
							dbCard = existingCard
						} else {
							const card = new Card(c)
							card.cardType = c.type
							let scryfallResponse = await fetch(`${scryfallCardsMultiverse}/${card.multiverseid}`)
							let scryfallJson = await scryfallResponse.json()
							card.largeImageUrl = scryfallJson.image_uris.large
							
							console.log("Creating", card.name)

							dbCard = card
							await card.save()
						}
					})
					return dbCard

				})

				res.send(cards)
				// .then(async duplicateCard => {
					// 	debugger
					// 	if (duplicateCard){
						//
						// 		console.log(`${c.name} is already in the database`)
						// 		cards.push(duplicateCard)
						// 	} else {
							//
							// 		const card = new Card(c)
							// 		card.cardType = c.type
							//
							// 		console.log("Creating", card.name)
							//
							// 		await card.save()
							// 		cards.push(card)
							// 	}
							//
							// })
				// debugger
				//
				// res.send(cards)

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
