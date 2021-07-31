const express = require('express')
const mongoose = require('mongoose')

const userRouter = require('./routes/UserRoutes')
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
} = require('./config/config')

const app = express()
app.use(express.json())
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Successfuly connected to DB')
    })
    .catch((err) => {
      console.error(err)
      setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()
app.enable('trust proxy')
app.get('/api/v1', (req, res) => {
  res.send(`<h2>Hi there from Docker Container in ${process.env.NODE_ENV}</h2>`)
})

app.use('/api/v1/users', userRouter)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))
