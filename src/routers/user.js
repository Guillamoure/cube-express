const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ })
    res.send(users)
  } catch (e){
    res.status(500).send()
  }
})

router.post('/signin', async (req, res) => {
  const data = req.body
  try {
    let user = await User.findOne(data)
    if (!user){
      user = await new User(data)
      user.save()
      res.status(201).send(user)
    } else {
      res.status(302).send(user)
    }
  } catch (e) {
    res.status(500).send()
  }
})


module.exports = router
