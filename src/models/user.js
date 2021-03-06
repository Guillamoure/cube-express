const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  }
})

userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})


const User = mongoose.model('User', userSchema)

module.exports = User
