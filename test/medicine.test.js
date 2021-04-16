const request = require('supertest')
const app = require('../app')

describe('Medicine', () => {
  describe('Create Medicine', () => {
    describe('POST /medicines', () => {
      describe('Correct request', () => {
        it('Should return new medicine', (done) => {
          const body = {
            name: 'panadol',
            description: 'sakit kepala',
            stock: 900,
          }
          request(app)
            .post('/medicines')
            .send(body)
            .end((err, res) => {
              expect(res.status).toBe(201)
              expect(res.body).toHaveProperty('id')
              expect(res.body).toHaveProperty('name', body.name)
              expect(res.body).toHaveProperty('description', body.description)
              expect(res.body).toHaveProperty('stock', body.stock)
              done()
            })
        })
      })
    })
  })
})
