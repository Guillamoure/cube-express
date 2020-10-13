const express = require('express')
const http = require('http')
require('./db/mongoose')
const userRouter = require('./routers/user')
const cardRouter = require('./routers/card')
const cors = require('cors')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 4444
const io = socketio(server)

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(cardRouter)

io.on('connection', () => {
	console.log("New Websocket Connection")
	io.emit('connectionEstablished')
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})

// fetch('http://localhost:4000/toys', {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json"
//   },
//   body: JSON.stringify({
//
//   })
// })
