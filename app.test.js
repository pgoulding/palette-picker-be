const request = require('supertest')
const app = require('./app')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('Server', () => {

  describe('init', () => {

    beforeEach(async () => {
      await database.seed.run()
    });

    it('HAPPY: Should return a 200 status', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
      expect(res.text).toBe(`Palette Picker is running on port ${app.get('port')}`)
    })

  })

  describe('GET /projects', () => {

    beforeEach(async () => {
      await database.seed.run()
    });

    it('HAPPY: Should return a 200 and all of the projects', async () => {
      const expectedProjects = await database('projects').select()
      const res = await request(app).get('/api/v1/projects');
      const projects = res.body
      expect(res.status).toBe(200)
      expect(projects[0].id).toEqual(expectedProjects[0].id)
      expect(projects[0].name).toEqual(expectedProjects[0].name)
    });

    it('HAPPY: Should return a single project with a matching primary ID', async () => {
      const expectedProject = await database('projects').select('*').where('id', 3)
      const res = await request(app).get('/api/v1/projects/3')
      const project = res.body;
      expect(res.status).toBe(200)
      expect(project.id).toEqual(expectedProject[0].id)
    });
    
    it('SAD: Should return a 404 error if project id does not exist', async () => {
      const res = await request(app).get('/api/v1/projects/20')
      expect(res.status).toBe(404)
      expect(res.body.message).toBe(`Project ID# 20 could not be found.`)
    });

  });

  describe('GET /palettes', () => {

    beforeEach(async () => {
      await database.seed.run()
    });

    it('HAPPY: Should return a 200 and all of the palettes', async () => {
      const expectedPalettes = await database('palettes').select()
      const res = await request(app).get('/api/v1/palettes')
      const palettes = res.body
      expect(res.status).toBe(200)
      expect(palettes[0].id).toEqual(expectedPalettes[0].id)
      expect(palettes[0].name).toEqual(expectedPalettes[0].name)
    });

    it('HAPPY: Should return a single palette with a matching primary ID', async () => {
      const expectedPalette = await database('palettes').select('*').where('id', 2)
      const res = await request(app).get('/api/v1/palettes/2')
      const palette = res.body;
      expect(res.status).toBe(200)
      expect(palette.id).toEqual(expectedPalette[0].id)
    });

    it('SAD: Should return a 404 error if palette id does not exist', async () => {
      const res = await request(app).get('/api/v1/palettes/2000')
      expect(res.status).toBe(404)
    });

  });

  describe('POST /projects', () => {

    it('HAPPY: Should post new project to the database', async () => {
      const newProject = { name: 'Trendy Sandwhich Shop' }
      const res = await request(app)
        .post('/api/v1/projects')
        .send(newProject)
        const projects = await database('projects').where('id', parseInt(res.body.id)).select()
        const project = projects[0]
        expect(res.status).toBe(201)
        expect(project.name).toEqual(newProject.name)
    });

    it('SAD: Should return an error if the name property is missing', async () => {
      const newProject = { name: '' }
      const res = await request(app)
        .post('/api/v1/projects')
        .send(newProject)
        expect(res.status).toBe(422)
    });

  });

  describe('POST /palettes', () => {

    beforeEach(async () => {
      await database.seed.run()
    });

    it('HAPPY: Should post new palette to the database', async () => {
      const newPalette = { 
        name: 'test_color_palette',
        color_1: '#grgrrg',
        color_2: '#grgrrg',
        color_3: '#grgrrg',
        color_4: '#grgrrg',
        color_5: '#grgrrg',
        project_id: 2
      }
      const res = await request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        const palettes = await database('palettes').where('id', parseInt(res.body.id)).select()
        const palette = palettes[0]
        expect(res.status).toBe(201)
        expect(palette.name).toEqual(newPalette.name)
    }); 

    it('SAD: Should return an error if the name property is missing', async () => {
      const newPalette = { 
        name: '',
        color_1: '#grgrrg',
        color_2: '#grgrrg',
        color_3: '#grgrrg',
        color_4: '#grgrrg',
        color_5: '#grgrrg',
        project_id: 2
      }
      const res = await request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        expect(res.status).toBe(422)
    });

    it('SAD: Should return an error if a color property is missing', async () => {
      const newPalette = { 
        name: 'Trendy Sandwich Shop',
        color_1: '#grgrrg',
        color_2: '#grgrrg',
        color_3: '',
        color_4: '#grgrrg',
        color_5: '#grgrrg',
        project_id: 2
      }

      const res = await request(app)
        .post('/api/v1/palettes')
        .send(newPalette)
        expect(res.status).toBe(422)
        expect(res.body.posted).toBe(false)
        expect(res.body.parameter).toBe('color_3')
    });

  });

  describe('PATCH /projects', () => {

    it('HAPPY: Should return a 202 when patching a project', async () => {
      const namePatch = { name: 'PATCH THIS NAME' }
      const originalTitle = await database('projects')
        .where('id', 1)
        .select()
      expect(originalTitle.name).not.toEqual(namePatch.name)
      const res = await request(app)
        .patch('/api/v1/projects/1')
        .send(namePatch)
      const newName = await database('projects')
        .where('id', 1)
        .select()
      expect(res.status).toEqual(202)
      expect(res.body.message).toEqual('Project ID# 1 has been updated')
      expect(newName[0].name).toEqual(namePatch.name)
    });

    it('SAD: Should return a 404 if no project with matching id is found', async () => {
      const namePatch = { name: 'PATCH THIS NAME' }
      const res = await request(app)
        .patch('/api/v1/projects/100')
        .send(namePatch)
      expect(res.status).toBe(404)
      expect(res.body.patched).toBe(false)
      expect(res.body.message).toEqual('Project ID# 100 does not exist.')
    });

  });

  describe('PATCH /palettes', () => {

    it('HAPPY: Should return a 202 when patching a palette', async () => {
      const palettePatch = { 
        name: 'PATCHED',
        color_3: 'color3'
      }
      const originalPalette = await database('palettes')
        .where('id', 1)
        .select()
      expect(originalPalette.name).not.toEqual(palettePatch.name)
      const res = await request(app)
        .patch('/api/v1/palettes/1')
        .send(palettePatch)
      const patchedPalette = await database('palettes')
        .where('id', 1)
        .select()

      expect(res.body.message).toEqual('Palette ID# 1 has been updated')
      expect(patchedPalette[0].name).toEqual(palettePatch.name)
      expect(patchedPalette[0].color_3).toEqual(palettePatch.color_3)
      expect(patchedPalette[0].color_2).toEqual(originalPalette[0].color_2)
    });

    it('SAD: Should return a 404 if no palette with matching id is found', async () => {
      const palettePatch = { 
        name: 'PATCHED',
        color_3: 'color3'
      }
      const res = await request(app)
        .patch('/api/v1/palettes/100')
        .send(palettePatch)
      expect(res.status).toBe(404)
      expect(res.body.message).toEqual('Palette ID# 100 does not exist.')
    });

    it('SAD: Should return an error message if the ID doesn\'t exist', async () => {
      const palettePatch = {
        name: 'PATCHED',
        color_3: 'color3'
      }
      const res = await request(app)
        .patch('/api/v1/palettes/100')
        .send(palettePatch)
      expect(res.body.message).toEqual('Palette ID# 100 does not exist.')
    })

    it('SAD: Should return posted = false if the ID doesn\'t exist', async () => {
      const palettePatch = {
        name: 'PATCHED',
        color_3: 'color3'
      }
      const res = await request(app)
        .patch('/api/v1/palettes/100')
        .send(palettePatch)
      expect(res.body.patched).toEqual(false)
    })

  });

  describe('DELETE /api/v1/projects', () => {

    beforeEach(async () => {
      await database.seed.run()
    });

    it('HAPPY: Should delete a project if the ID is found', async () => {
      const res = await request(app)
        .delete('/api/v1/projects/1')
      expect(res.status).toEqual(202)
      expect(res.body.message).toEqual('Project ID# 1 has been deleted.')
    })

    it('SAD: Should send an error if the id doesnt exist', async ()=> {
      const res = await request(app)
      .delete('/api/v1/projects/112')
    expect(res.status).toEqual(404)
    expect(res.body.message).toEqual('Project ID# 112 does not exist.')
    })

  })

  describe('DELETE /api/v1/palettes', () => {

    beforeEach(async () => {
      await database.seed.run()
    });

    it('HAPPY: Should delete palette if the ID exists', async () => {
      const res = await request(app)
        .delete('/api/v1/palettes/1')
      expect(res.status).toEqual(202)
      expect(res.body.message).toEqual('Palette ID# 1 has been deleted.')
    })

    it('SAD: Should send an error if the id doesnt exist', async () => {
      const res = await request(app)
      .delete('/api/v1/palettes/112')
    expect(res.status).toEqual(404)
    })

    it('SAD: Should send back a message with the requested ID if the ID doesnt exist', async () => {
      const res = await request(app)
        .delete('/api/v1/palettes/112')
      expect(res.body.message).toEqual('Palette ID# 112 does not exist.')
    })

    it('SAD: Should send a 500 error', async () => {

    })

  })

});
