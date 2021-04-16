const request = require('supertest')
const app = require('../app')

describe('Account', () => {
  describe('Create New Account', () => {
    describe('POST /register', () => {
      describe('Correct request', () => {
        it('Should return new account with role of Patient', (done) => {
          const body = {
            name: 'Jack',
            username: 'jack',
            password: 'pass1234',
            email: 'jack@jack.com',
            comorbid: ['high blood pressure', 'anemia'],
            age: 28,
            gender: 'male',
          }

          request(app)
            .post('/register')
            .send(body)
            .end((err, res) => {
              expect(res.status).toBe(201)
              expect(res.body).toHaveProperty('id')
              expect(res.body).toHaveProperty('email', body.email)
              expect(res.body).not.toHaveProperty('password')
              expect(res.body).toHaveProperty('name', body.name)
              expect(res.body).toHaveProperty('role', 'patient')
              done()
            })
        })
        it('Should return new account with role of Doctor', (done) => {
          const body = {
            name: 'Razza',
            username: 'razza',
            password: 'pass1234',
            email: 'razza@doctor.com',
            speciality: ['tht', 'organ dalam'],
            practice: [
              {
                day: 'monday',
                start: '9:15',
                end: '15:45',
              },
              {
                day: 'tuesday',
                start: '9:15',
                end: '15:45',
              },
            ],
            age: 28,
            gender: 'male',
          }

          request(app)
            .post('/register')
            .send(body)
            .end((err, res) => {
              expect(res.status).toBe(201)
              expect(res.body).toHaveProperty('id')
              expect(res.body).toHaveProperty('email', body.email)
              expect(res.body).not.toHaveProperty('password')
              expect(res.body).toHaveProperty('name', body.name)
              expect(res.body).toHaveProperty('role', 'doctor')
              expect(res.body).toHaveProperty('practice')
              expect(Array.isArray(res.body.practice)).toBe(true)
              done()
            })
        })
      })
    })
  })
  describe('Account Login', () => {
    describe('POST /login', () => {
      describe('Correct Request', () => {
        it('Should return account detail with its access token', (done) => {
          const body = {
            email: 'jack@jack.com',
            password: 'pass1234',
          }
          request(app)
            .post('/register')
            .send(body)
            .end((err, res) => {
              expect(res.status).toBe(201)
              expect(res.body).toHaveProperty('id')
              expect(res.body).toHaveProperty('email', body.email)
              expect(res.body).not.toHaveProperty('password')
              expect(res.body).toHaveProperty('role', 'patient')
              done()
            })
        })
      })
    })
  })
})
