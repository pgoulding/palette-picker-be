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

app.get('/api/v1/projects', (req, res) => {
  const { title } = app.locals
  res.status(200).json({title})
})