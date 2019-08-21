import request from 'supertest'
const app = require('./app')
const environment = process.env.NODE_ENV || 'development'
const configuration = require('./knexfile')[environment]
const database = require('knex')(configuration)

describe('Server', () => {

  beforeEach(async () => {
    await database.seed.run()
  })

  describe('init', () => {

    it('should return a 200 status', async () => {
      const res = await request(app).get('/api/v1/projects')
      expect(res.status).toBe(200)
    })

  })

  describe('GET /projects', () => {

    it('should return a 200 and all of the projects', async () => {

      const expectedProjects = await database('projects').select()
      const res = await request(app).get('/api/v1/projects')
      const projects = res.body
      expect(res.status).toBe(200)
      expect(projects[0].id).toEqual(expectedProjects[0].id)
      expect(projects[0].name).toEqual(expectedProjects[0].name)
    })

  })
//   describe('GET /students', () => {

//     it('HAPPY: Should return a status of 200', async () => {
//       // const res = await 
//     })

//     it('HAPPY: Should return all the students', async () => {
//       const expectedStudents = await database('students').select()
//       const response = await request(app).get('/students')
//       const students = response.body
//       expect(response.status).toBe(200)
//       expect(students).toEqual(expectedStudents)

//     })

//   })

//   describe('GET /api/v1/students/:id', () => {

//     it('HAPPY: Should return a student given an id', async () => {
//       const student = await database('students').first()
//       const { id } = student
//       const response = await request(app).get(`/students/${id}`)
//       const scholar = response.body
//       expect(response.status).toBe(200)
//       expect(scholar.id).toEqual(id)
//     })

//     it('SAD: Should send an error for student not found', async () => {

//     })
//   })

//   describe('POST /students', () => {

//     it('HAPPY: Should post a student', async () => {

//       const mockStudent = {
//         lastName: "Roberson",
//         program: "FE",
//         enrolled: true
//       }
//       const res = await request(app)
//         .post('/students')
//         .send(mockStudent)

//       const students = await database('students').where('id', res.body.id).select()
//       const student = students[0]

//       expect(res.status).toBe(201)
//       expect(student.lastname).toEqual(mockStudent.lastname)
//     })

//   })

})
