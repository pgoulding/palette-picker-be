const express = require('express')
const app = express()
const cors = require('cors')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const dbConnect = require('knex')(configuration)
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
// GETS
app.get('/api/v1/projects', (req, res) => {

})

app.get('/api/v1/palettes', (req, res) => {
  dbConnect('palettes')
    .select('*')
    .then(result => res.status(200).json(result))
})

app.get('/api/v1/projects/:id', (req, res) => {

})

app.get('/api/v1/palettes/:id', (req, res) => {
  const { id } = req.params
  dbConnect('palettes')
    .where({id})
    .first()
    .then(palette => {
      if(!palette) {
        res.status(404).send(`Palette id ${id} Not Found`)
      }
      res.status(200).json(palette)
    })
    .catch(error => res.status(404).json(
        { 
        error: error.message, 
        stack: error.stack 
      }
    ))
})

//POSTS

app.post('/api/v1/projects', (req, res) => {

})

app.post('/api/v1/palettes', (req, res) => {
  const pallete = req.body

  for (let requiredParameter of ['name','color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
    if (!req.body[requiredParameter]) {
      return res
        .status(422)
        .send({ error: `You're missing a "${requiredParameter}" property.` });
    };
  };

  dbConnect('palettes')
    .insert(pallete, 'id')
    .then(result => {
      if(!result) {
        res.status(422).send(`Missing Content`)
      }
        res.status(201).send(`Pallete id ${result} created sucessfully.`)
    })
    .catch(error => res.status(404).send(`Error creating pallete: ${error.message}`))
})

//PUTS

app.put('/api/v1/projects/:id', (req, res) => {

})

app.put('/api/v1/palettes/:id', (req, res) => {

})

//DELETES

app.delete('/api/v1/projects/:id', (req, res) => {

})

app.delete('/api/v1/palettes/:id', (req, res) => {
  
})

//CUSTOM QUERY PARAM