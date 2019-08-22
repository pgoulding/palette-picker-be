const projects = require('../../mockProjects')

const createProject = (knex, project) => {
  return (
    knex('projects').insert(
      {
        name: project.name
      }, 'id'
    ).then(projectId => {
      let palettePromises = []

      project.palettes.forEach(palette => {
        palettePromises.push(createPalette(knex, {...palette, project_id:projectId[0]}))
      })

      return Promise.all(palettePromises)
    })

  )
}

const createPalette =(knex, palette) => {
  return (
    knex('palettes').insert(palette)
  )
}

exports.seed = function(knex) {
  return knex('palettes').del()
    .then(knex('projects').del())
    .then( () => {
      let projectsPromises = []
      projects.forEach(project => {
        projectsPromises.push(createProject(knex, project))
      }) 
      return Promise.all(projectsPromises)
    })
    .catch(error => console.error(`Error seeding data: ${error}`))
};