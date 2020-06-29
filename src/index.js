const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 4444

app.use(express.json())
app.use(cors())
app.use(userRouter)

app.listen(port, () => {
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
