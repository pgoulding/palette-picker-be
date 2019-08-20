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
  dbConnect('palettes')
    .select('*')
    .then(result => res.status(200).json(result))
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
  if (!req.body['name']) {
    return res 
      .status(422)
      .send(`You're missing a "NAME" property.`);
  };

  const project = {
    name: req.body.name
  }

  dbConnect('projects').insert(project, 'id')
    .then(id => {
      if (!id) {
        res.status(404).send('ID was not returned from database, your submission may or may not have been successful.')
      }
      res.status(201).json({ id: project[0] })
    })
    .catch(error => {
      res.status(500).json({ error: error.message, stack: error.stack })
    })
});

app.post('/api/v1/palettes', (req, res) => {

})

//PUTS

app.put('/api/v1/projects/:id', (req, res) => {

})

app.put('/api/v1/palettes/:id', (req, res) => {

})

//DELETES

app.delete('/api/v1/projects/:id', (req, res) => {
  const requestId = req.params.id;
  dbConnect('projects')
    .where({ id: requestId })
    .del()
    .then(() => res.status(202).json({ 
      message: `Project ${requestId} has been deleted.`
    }))
    .catch(error => res.status(500).json({ error: error.message, stack: error.stack }))
});

app.delete('/api/v1/palettes/:id', (req, res) => {
  const requestId = req.params.id;
  dbConnect('palettes')
    .where({ id: requestId })
    .del()
    .then(() => res.status(202).json({ 
      message: `Palette ${requestId} has been deleted.`
    }))
    .catch(error => res.status(500).json({ error: error.message, stack: error.stack }))
});

//CUSTOM QUERY PARAM