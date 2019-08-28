const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const dbConnect = require('knex')(configuration)

require('dotenv').config()
app.use(express.json());
app.use(cors())
app.use(bodyParser.json())
app.set('port', process.env.PORT || 3000)

app.locals.title = 'Palette Picker'

// GETS

app.get('/', (req, res) => {
  const { title } = app.locals
  res.status(200).send(`${title} is running on port ${app.get('port')}`)
})

app.get('/api/v1/projects', (req, res) => {
  dbConnect('projects')
    .select('*')
    .then(projects => {
      if (!projects.length) {
        return res.status(404).json(
          {
            message: "Cannot find any Projects at this time."
          }
        )
      };
      res.status(200).json(projects)
    })
    .catch(error => res.status(500).json(
      { 
        error: error.message, 
        stack: error.stack 
      }
    ))
})

app.get('/api/v1/palettes', (req, res) => {
  dbConnect('palettes')
    .select('*')
    .then(palettes => {
      if (!palettes.length) {
        return res.status(404).json(
          {
            message: "Cannot find any Palettes at this time."
          }
        )
      }
      res.status(200).json(palettes)
    })
    .catch(error => res.status(500).json(
      { 
        error: error.message, 
        stack: error.stack 
      }
    ))
})

app.get('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params
  dbConnect('projects')
    .where({ id })
    .first()
    .then(project => {
      dbConnect
        .select('*')
        .from('projects')
        .joinRaw('natural full join palettes')
        .where('project_id', id)
        .then(palette => (
          { 
            ...project, 
            palette 
          }
        ))
        .then(project => {
          if (!project.id) {
            return res.status(404).json(
              {
                message:`Project ID# ${req.params.id} could not be found.`
              }
            )
          };
          res.status(200).json(project)
        })
    })
    .catch(error => res.status(500).json(
      {
        error: error.message,
        stack: error.stack
      }
    ))
})

app.get('/api/v1/palettes/:id', (req, res) => {
  const { id } = req.params
  dbConnect('palettes')
    .where({ id })
    .first()
    .then(palette => {
      if (!palette) {
        return res.status(404).json(
          {
          message:`Project ID# ${id} could not be found.`
          }
        )
      }
      res.status(200).json(palette)
    })
    .catch(error => res.status(500).json(
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
      .json(
        {
          message:`You're missing a "NAME" property.`
        }
      );
  };

  const project = req.body

  dbConnect('projects')
    .insert(project, 'id')
    .then(projectId => {
      if (!projectId) {
        return res.status(404).json(
          {
            posted:false,
            message:'New Project ID was not returned from database, your submission may or may not have been successful.'
          }
        )
      }
      res.status(201).json(
        { 
          posted:true,
          id: projectId[0], 
          ...project,
          message: 'New Project creation successful' 
        }
      )
    })
    .catch(error => {
      res.status(500).json(
        {
          error: error.message, 
          stack: error.stack 
        }
      )
    })
});

app.post('/api/v1/palettes', (req, res) => {
  for (let requiredParameter of ['name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'project_id']) {
    
    if (!req.body[requiredParameter]) {
      return res
        .status(422)
        .json(
          { 
            posted: false,
            parameter:requiredParameter,
            error: `You're missing a "${requiredParameter}" property.` 
          }
        );
    };
  };

  const palette = req.body

  dbConnect('palettes')
    .insert(palette, 'id')
    .then(paletteId => {
      if (!paletteId) {
        return res.status(404).json(
          {
            posted:false,
            message:'New Palette ID was not returned from database, your submission may or may not have been successful.',
          }
        )
      }
      res.status(201).json(
        { 
          posted:true,
          id: paletteId[0], 
          name:palette.name,
          message: 'New Palette creation successful' 
        }
      )
    })
    .catch(error => {
      res.status(500).json(
        { 
          error: error.message, 
          stack: error.stack 
        }
      )
    })
})

//PATCH

app.patch('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params
  const updates = req.body
  dbConnect('projects')
    .where({ id })
    .update({ ...updates })
    .then(projectId => {
      if (!projectId) {
        return res.status(404).json(
          {
            patched:false,
            message:`Project ID# ${id} does not exist.`
          }
        )
      }
      res.status(202).json(
        {
          patched:true,
          message:`Project ID# ${projectId} has been updated`
        }
      )
    })
    .catch(error => res.status(500).json(
      {
        error: error.message,
        stack: error.stack
      }
    ))
});

app.patch('/api/v1/palettes/:id', (req, res) => {
  const { id } = req.params
  const updates = req.body
  dbConnect('palettes')
    .where({ id })
    .update({ ...updates })
    .then(paletteId => {
      if (!paletteId) {
        return res.status(404).json(
          {
            patched:false,
            message:`Palette ID# ${id} does not exist.`
          }
        )
      }
      res.status(202).json(
        {
          patched: true,
          ...id,
          message:`Palette ID# ${paletteId} has been updated`
        }
      )
    })
    .catch(error => res.status(500).json(
      {
        error: error.message,
        stack: error.stack
      }
    ))
});

//DELETES

app.delete('/api/v1/projects/:id', (req, res) => {
  const { id } = req.params;
  dbConnect('projects')
    .where({ id })
    .del()
    .then(projectID => {
      if(!projectID) {
        return res.status(404).json({
          deleted:false,
          ...id,
          message:`Project ID# ${id} does not exist.`
        })
      }
      res.status(202).json(
        {
          deleted:true,
          ...id,
          message:`Project ID# ${id} has been deleted.`
        }
      )
    })
    .catch(error => res.status(500).json(
      {
        error: error.message,
        stack: error.stack
      }
    ))
});

app.delete('/api/v1/palettes/:id', (req, res) => {
  const { id } = req.params;
  dbConnect('palettes')
    .where({ id })
    .del()
    .then(paletteID => {
      if(!paletteID) {
        return res.status(404).json(
          {
            deleted: false,
            id,
            message:`Palette ID# ${id} does not exist.`
          }
        )
      }
      res.status(202).json(
        {
          deleted:true,
          id,
          message:`Palette ID# ${id} has been deleted.`
        }
      )
    })
    .catch(error => res.status(500).json(
      {
        error: error.message,
        stack: error.stack
      }
    ))
});

module.exports = app;

//CUSTOM QUERY PARAM