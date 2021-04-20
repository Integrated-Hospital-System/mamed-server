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

let access_token, doctorId, patientId

beforeAll((done) => {
  const resetDB = async () => {
    await mongoose.connect(connection.getDBName(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await mongoose.connection.db.dropCollection('accounts')
    await new Admin(admin).save()
    done()
  }
  resetDB()
})

describe('Account', () => {
  describe('Patient Register', () => {
    describe('POST /register', () => {
      describe('Correct request(s)', () => {
        it('Should return new account with role of Patient', async (done) => {
          const body = {
            name: 'Jack',
            username: 'jack',
            password: 'pass1234',
            email: 'jack@jack.com',
            comorbid: ['high blood pressure', 'anemia'],
            age: 28,
            gender: 'male',
          }

          const res = await request(app).post('/register').send(body)
          expect(res.status).toBe(201)
          expect(res.body).toHaveProperty('_id')
          expect(res.body).toHaveProperty('email', body.email)
          expect(res.body).toHaveProperty('name', body.name)
          expect(res.body).toHaveProperty('role', 'Patient')
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating already exist', async (done) => {
          const body = {
            name: 'Jack',
            username: 'jack',
            password: 'pass1234',
            email: 'jack@jack.com',
            comorbid: ['high blood pressure', 'anemia'],
            age: 28,
            gender: 'male',
          }

          const res = await request(app).post('/register').send(body)
          expect(res.status).toBe(400)
          done()
        })
      })
    })
  })
  describe('Account Login', () => {
    describe('POST /login', () => {
      describe('Correct request(s)', () => {
        it('Should return account detail with its access token', async (done) => {
          const body = {
            email: 'jack@jack.com',
            password: 'pass1234',
          }
          const res = await request(app).post('/login').send(body)
          expect(res.status).toBe(200)
          expect(res.body.account).toHaveProperty('_id')
          expect(res.body.account).toHaveProperty('email', body.email)
          expect(res.body.account).toHaveProperty('role', 'Patient')
          expect(res.body).toHaveProperty('access_token')
          patientId = res.body.account._id
          done()
        })
        it('Should return admin', async (done) => {
          const res = await request(app).post('/login').send(admin)
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('access_token')
          access_token = res.body.access_token
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating invalid email or password', async (done) => {
          const body = {
            email: 'jack@jack.com',
            password: 'wrongpassword',
          }
          const res = await request(app).post('/login').send(body)
          expect(res.status).toBe(401)
          expect(res.body.message[0]).toBe('invalid email or password')
          console.log(res.body)
          done()
        })
        it('Should return error indicating required field empty', async (done) => {
          const res = await request(app).post('/login').send({})
          expect(res.status).toBe(400)
          console.log(res.body)
          done()
        })
        it('Should return error indicating email not registered in database', async (done) => {
          const body = { email: 'anonym@email.com' }
          const res = await request(app).post('/login').send(body)
          expect(res.status).toBe(400)
          console.log(res.body)
          done()
        })
      })
    })
  })
  describe('Account Create', () => {
    describe('POST /accounts', () => {
      describe('Correct request(s)', () => {
        it('Should return new account with role of Doctor', async (done) => {
          const practice0 = {
            day: 'monday',
            start: '9:15',
            end: '15:45',
          }
          const practice1 = {
            day: 'tuesday',
            start: '9:15',
            end: '15:45',
          }
          const body = {
            name: 'Razza',
            password: 'pass1234',
            role: 'Doctor',
            email: 'razza@doctor.com',
            speciality: ['tht', 'organ dalam'],
            practice: [practice0, practice1],
            age: 28,
            gender: 'male',
          }

          const res = await request(app)
            .post('/accounts')
            .send(body)
            .set({ access_token })

          expect(res.status).toBe(201)
          expect(res.body).toHaveProperty('_id')
          expect(res.body).toHaveProperty('email', body.email)
          expect(res.body).toHaveProperty('name', body.name)
          expect(res.body).toHaveProperty('role', 'Doctor')
          expect(res.body.practice[1]).toMatchObject(practice1)
          expect(res.body.speciality[1]).toBe('organ dalam')
          doctorId = res.body._id
          done()
        })
      })
      describe('Incorrect request(s)', () => {})
    })
  })
  describe('Show Current User', () => {
    describe('GET /accounts/index', () => {
      describe('Correct request(s)', () => {
        it('Should return current logged user based on access_token', async (done) => {
          const res = await request(app)
            .get('/accounts/index')
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('role', 'Admin')
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const res = await request(app).get('/accounts/index')
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message')
          done()
        })
      })
    })
  })

  describe('Show All Account', () => {
    describe('GET /accounts', () => {
      describe('Correct request(s)', () => {
        it('Should return all accounts', async (done) => {
          const res = await request(app).get('/accounts').set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.length).toBe(3)
          done()
        })
        it('Should return all Patients', async (done) => {
          const res = await request(app)
            .get('/accounts?role=Doctor')
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.length).toBe(1)
          done()
        })
        it('Should return all Doctors', async (done) => {
          const res = await request(app)
            .get('/accounts?role=Doctor')
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.length).toBe(1)
          done()
        })
      })
    })
  })
  describe('Show One Account', () => {
    describe('GET /accounts/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return Account information', async (done) => {
          const id = doctorId.toString()
          const practice = {
            day: 'tuesday',
            start: '9:15',
            end: '15:45',
          }
          const res = await request(app)
            .get(`/accounts/${id}`)
            .set({ access_token })

          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('_id')
          expect(res.body).toHaveProperty('role', 'Doctor')
          expect(res.body.practice[1]).toMatchObject(practice)
          expect(res.body.speciality[1]).toBe('organ dalam')
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const id = doctorId.toString()
          const res = await request(app).get(`/accounts/${id}`)
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
  describe('Update One Account', () => {
    describe('PUT /accounts/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return updated Doctor', async (done) => {
          const id = doctorId.toString()
          const practice = {
            day: 'sunday',
            start: '0:00',
            end: '23:59',
          }
          const body = {
            name: 'Razzil the greed Doctor',
            practice: [practice],
          }
          const res = await request(app)
            .put(`/accounts/${id}`)
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.practice[0]).toMatchObject(practice)
          done()
        })
        it('Should return updated Patient', async (done) => {
          const id = patientId.toString()
          const comorbid = 'gonorhea'
          const body = {
            name: 'Dawnbreaker the sick man',
            comorbid: [comorbid],
          }
          const res = await request(app)
            .put(`/accounts/${id}`)
            .send({ ...body, password: 'dota1234' })
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toMatchObject(body)
          expect(res.body).toHaveProperty('name', body.name)
          done()
        })
      })
      describe('Incorrect request(s)', () => {})
    })
  })
  describe('Delete One Account', () => {
    describe('DELETE /accounts/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return message indicating the account is deleted', async (done) => {
          const res = await request(app)
            .delete(`/accounts/${patientId.toString()}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty(
            'message',
            'Account successfully deleted'
          )
          done()
        })
        it('Should return null indicating the account is deleted', async (done) => {
          const id = patientId.toString()
          const res = await request(app)
            .get(`/accounts/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toBe(null)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const res = await request(app).delete(
            `/accounts/${patientId.toString()}`
          )
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
})
