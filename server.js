const express = require('express')
const app = express()
const cors = require('cors')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const dbConnect = require('knex')(configuration);
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
  dbConnect('projects')
  .select('*')
  .then(projects => {
    if (!projects.length) {
      return res.status(404).send("Cannot find any projects at this time.")
    };
    res.status(200).json(projects)
  })
  .catch(error => res.status(500).json({ error: error.message, stack: error.stack }))
})

app.get('/api/v1/palettes', (req, res) => {

})

app.get('/api/v1/projects/:id', (req, res) => {
  dbConnect('projects')
  .where({ id:  req.params.id})
  .first()
  .then(project => {
    if (!project) {
      return res.status(404).send(`Project ID# ${req.params.id} could not be found.`)
    };
    res.status(200).json(project)
  })
  .catch(error => res.status(500).json({ error: error.message, stack: error.stack }))
})

app.get('/api/v1/palettes/:id', (req, res) => {

})

//POSTS

app.post('/api/v1/projects', (req, res) => {

})

app.post('/api/v1/palettes', (req, res) => {

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