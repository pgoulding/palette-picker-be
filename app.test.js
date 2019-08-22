const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('Server', () => {
  describe('init', () => {
    // beforeEach(async () => {
    //   await database.seed.run()
    // });
    it('should return a 200 status', async () => {
      const res = await request(app).get('/api/v1/projects')
      expect(res.status).toBe(200)
    })

  })

  describe('GET /projects', () => {
    // beforeEach(async () => {
    //   await database.seed.run()
    // });
    it('should return a 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select()
      const res = await request(app).get('/api/v1/projects');
      const projects = res.body
      expect(res.status).toBe(200)
      expect(projects[0].id).toEqual(expectedProjects[0].id)
      expect(projects[0].name).toEqual(expectedProjects[0].name)
    });
    it('should return a single project with a matching primary ID', async () => {
      const expectedProject = await database('projects').select('*').where('id', 1)
      const res = await request(app).get('/api/v1/projects/1')
      const project = res.body;
      expect(res.status).toBe(200)
      expect(project.id).toEqual(expectedProject.id)
    })
  });
  describe('GET /palettes', () => {

    it('should return a 200 and all of the palettes', async () => {

      const expectedPalettes = await database('palettes').select()
      const res = await request(app).get('/api/v1/palettes')
      const palettes = res.body
      expect(res.status).toBe(200)
      expect(palettes[0].id).toEqual(expectedPalettes[0].id)
      expect(palettes[0].name).toEqual(expectedPalettes[0].name)
    })
  })
})
