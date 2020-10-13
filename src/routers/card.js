const express = require('express')
const fetch = require("node-fetch")
const Card = require('../models/card')
const router = new express.Router()
let url = "https://api.magicthegathering.io/v1/cards"

router.get('/cards', async (req, res) => {
  console.log("YOOOOO")
  try {
    const dbCards = await Card.find({})
    fetch(`${url}?name=heliod`)
    .then(r => {
      console.log("grabbed them! converting....")
      return r.json()
    })
    .then(data => {
      console.log("found them!")
      res.send(data)

    })
  } catch (e){
    res.status(500).send()
  }
})

router.post('/cards', async (req, res) => {
  console.log("hit")
})


module.exports = router
