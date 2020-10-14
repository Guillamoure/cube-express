const express = require('express')
const http = require('http')
require('./db/mongoose')
const userRouter = require('./routers/user')
const cardRouter = require('./routers/card')
const cors = require('cors')
const socketio = require('socket.io')
const { v4: uuidv4 } = require('uuid')


const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 4444
const io = socketio(server)

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(cardRouter)

const clients = []

io.on('connection', (socket) => {
	socket.on('join', () => {
		var userID = uuidv4()
		console.log(socket)
		clients.push({socket, userID})
		console.log("recieved a join!")
		socket.emit('welcome', {userID})
	})

	socket.on('joinRoom', (data) => {
		let client = clients.find(c => c.userID === data.userID)
		client.gameData = {numOfPlayers: data.numOfPlayers, players: data.players}
		client.user = data.user
		client._id = data._id

		// gather all clients that are missing players
    let playersMissingPlayers = clients.filter(cl => cl.gameData.numOfPlayers > cl.gameData.players.length && cl._id !== client._id)

		if (playersMissingPlayers.length === 0){
			// if there is no room_id, create on
			client.gameData.roomID = uuidv4()
			client.gameData.players.push({user: client.user, userID: client.userID})

			socket.emit('joinRoom', {players: client.gameData.players, roomID: client.gameData.roomID, numOfPlayers: client.gameData.numOfPlayers})
		} else {
			// select from the beginning of that array
			let chosenPlayer = playersMissingPlayers[0]
			// otherwise, add room_id
			client.gameData.roomID = chosenPlayer.gameData.roomID
			// update all players with player data
			chosenPlayer.gameData.players.push({user: client.user, userID: client.userID})
			chosenPlayer.socket.emit('joinRoom', {players: chosenPlayer.gameData.players, roomID: chosenPlayer.gameData.roomID, numOfPlayers: chosenPlayer.gameData.numOfPlayers})

			clients.forEach(cl => {
				if (cl.userID !== chosenPlayer.userID && cl.gameData.roomID === chosenPlayer.gameData.roomID){
					if (cl.userID === client.userID){
						cl.gameData.players = [...chosenPlayer.gameData.players]
					} else {
						cl.gameData.players.push({user: client.user, userID: client.userID})
					}
					// send a message to all members of the room
					cl.socket.emit('joinRoom', {players: chosenPlayer.gameData.players, roomID: chosenPlayer.gameData.roomID, numOfPlayers: chosenPlayer.gameData.numOfPlayers})
				}
			})
		}
	})
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
