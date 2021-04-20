require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const connection = require('../helpers/db-connection')
const { Admin } = require('../models/account')
const admin = {
  name: 'Admin',
  email: 'admin@email.com',
  password: 'test1234',
}

let access_token, doctorId, patientId, medicineId

beforeAll((done) => {
  const resetDB = async () => {
    await mongoose.connect(connection.getDBName(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await mongoose.connection.db.dropDatabase(connection.getDBName())
    await new Admin(admin).save()
    const res = await request(app).post('/login').send(admin)
    access_token = res.body.access_token
    done()
  }
  resetDB()
})

describe('Medicine', () => {
  describe('Create Medicine', () => {
    describe('POST /medicines', () => {
      describe('Correct request', () => {
        it('Should return new medicine', async (done) => {
          const body = {
            name: 'panadol',
            description: 'sakit kepala',
            stock: 900,
          }
          const res = await request(app)
            .post('/medicines')
            .send(body)
            .set({ access_token })

          expect(res.status).toBe(201)
          expect(res.body).toHaveProperty('_id')
          expect(res.body).toHaveProperty('name', body.name)
          expect(res.body).toHaveProperty('description', body.description)
          expect(res.body).toHaveProperty('stock', body.stock)
          medicineId = res.body._id
          done()
        })
      })

      describe('Incorrect request', () => {
        it('Should return medicine name is required', async (done) => {
          const body = {
            description: 'sakit kepala',
            stock: 900,
          }
          const res = await request(app)
            .post('/medicines')
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('message', [
            'Medicine name is required',
          ])
          done()
        })
      })
    })
  })
  describe('Read All Medicines', () => {
    describe('GET /medicines', () => {
      describe('Correct requests', () => {
        it('Should return all of the medicines', (done) => {
          request(app)
            .get('/medicines')
            .set({ access_token })
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(Array.isArray(res.body)).toBe(true)
              done()
            })
        })
      })
    })
  })

  describe('Read One Medicine', () => {
    describe('GET /medicines/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return one medicine', async (done) => {
          const id = medicineId.toString()
          const res = await request(app)
            .get(`/medicines/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('_id', id)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return internal server error', async (done) => {
          const id = medicineId.toString()
          const res = await request(app)
            .get(`/medicines/${id}acd`)
            .set({ access_token })
          expect(res.status).toBe(500)
          expect(res.body).toHaveProperty('message', ['internal server error'])
          done()
        })
      })
    })
  })

  describe('Update Medicine', () => {
    describe('PUT /medicines/1', () => {
      describe('Correct requests', () => {
        it('Should return one updated medicine', async (done) => {
          const id = medicineId.toString()
          const body = {
            name: 'panadol',
            description: 'sakit kepala',
            stock: 900,
          }
          const res = await request(app)
            .put(`/medicines/${id}`)
            .set({ access_token })
            .send(body)
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('_id', id)
          done()
        })
      })
      describe('Incorrect requests', () => {
        it('Should return medicine name is required', async (done) => {
          const id = medicineId.toString()
          const body = {}
          const res = await request(app)
            .put(`/medicines/${id}a`)
            .set({ access_token })
            .send(body)
          expect(res.status).toBe(500)
          expect(res.body).toHaveProperty('message', ['internal server error'])
          done()
        })
      })
    })
  })
  describe('Delete Medicine', () => {
    describe('DELETE /medicines/1', () => {
      describe('Correct requests', () => {
        it('Should return deleted message', async (done) => {
          const id = medicineId.toString()
          const res = await request(app)
            .delete(`/medicines/${id}`)
            .set({ access_token })

          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty(
            'message',
            'Medicine successfully deleted'
          )
          done()
        })
      })

      describe('Incorrect requests', () => {
        it('Should return internal server error', async (done) => {
          const id = medicineId.toString()
          const res = await request(app)
            .delete(`/medicines/${id} + a`)
            .set({ access_token })

          expect(res.status).toBe(500)
          expect(res.body).toHaveProperty('message', ['internal server error'])
          done()
        })
      })
    })
  })
})
