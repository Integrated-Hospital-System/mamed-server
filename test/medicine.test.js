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
  describe('Read All Medicines', () => {
    describe('GET /medicines', () => {
      describe('Correct requests', () => {
        it('Should return all of the medicines', (done) => {
          request(app)
            .get('/medicines')
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
    describe('GET /medicines/1', () => {
      describe('Correct requests', () => {
        it('Should return one medicine', (done) => {
          const id = '1'
          request(app)
            .get(`/medicines/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })

  describe('Update Medicine', () => {
    describe('PUT /medicines/1', () => {
      describe('Correct requests', () => {
        it('Should return one updated medicine', (done) => {
          const id = '1'
          request(app)
            .put(`/medicines/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })
  describe('Delete Medicine', () => {
    describe('DELETE /medicines/1', () => {
      describe('Correct requests', () => {
        it('Should return deleted message', (done) => {
          const id = '1'
          request(app)
            .delete(`/medicines/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty(
                'message',
                'medicine successfully deleted'
              )
            })
        })
      })
    })
  })
})
