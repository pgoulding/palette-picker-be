const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.json());
app.use(cors())

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}`)
})

app.locals.title = 'pallete picker'

app.get('/', (req, res) => {
  const { title } = app.locals
  res.status(200).send(`${title} is running on port ${app.get('port')}`)
})

app.get('/api/v1/projects', (req, res) => {

})

app.get('/api/v1/palettes', (req, res) => {

})

app.post('/api/v1/projects', (req, res) => {

})

app.post('/api/v1/palettes', (req, res) => {

})

app.put('/api/v1/projects/:id', (req, res) => {

})

app.put('/api/v1/palettes/:id', (req, res) => {

})

app.get('/api/v1/projects/:id', (req, res) => {

})

app.get('/api/v1/palettes/:id', (req, res) => {

})

app.delete('/api/v1/projects/:id', (req, res) => {

})

app.delete('/api/v1/palettes/:id', (req, res) => {

})