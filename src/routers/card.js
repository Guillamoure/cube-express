const express = require('express')
const Card = require('../models/card')
const router = new express.Router()

router.get('/cards', async (req, res) => {
  console.log("YOOOOO")
  try {
    const cards = ["found you!", "gotta search the API"]
    res.send(cards)
  } catch (e){
    res.status(500).send()
  }
})


module.exports = router
