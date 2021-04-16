const request = require('supertest')
const app = require('../app')

describe('Order', () => {
  describe('Create Order', () => {
    describe('POST /orders', () => {
      describe('Correct requests', () => {
        it('Should create one order', (done) => {
          const body = {
            appointmentId: '1',
            medicines: [
              {
                medicineId: '1',
                timesPerDay: 2,
                doses: 3,
                totalMedicine: 9,
              },
              {
                medicineId: '1',
                timesPerDay: 2,
                doses: 3,
                totalMedicine: 9,
              },
            ],
            diseases: ['migraine'],
          }
          request(app)
            .post('/orders')
            .send(body)
            .end((err, res) => {
              expect(res.status).toBe(201)
              expect(res.body).toHaveProperty('appointment')
              expect(res.body).toHaveProperty('medicines')
              expect(res.body).toHaveProperty('diseases')
              done()
            })
        })
      })
    })
  })
  describe('Read All Orders', () => {
    describe('GET /orders', () => {
      describe('Correct requests', () => {
        it('Should return all of the orders', (done) => {
          request(app)
            .get('/orders')
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(Array.isArray(res.body)).toBe(true)
              done()
            })
        })
      })
    })
  })

  describe('Read One Order', () => {
    describe('GET /orders/1', () => {
      describe('Correct requests', () => {
        it('Should return one order', (done) => {
          const id = '1'
          request(app)
            .get(`/orders/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })

  describe('Update Order', () => {
    describe('PUT /orders/1', () => {
      describe('Correct requests', () => {
        it('Should return one updated order', (done) => {
          const id = '1'
          request(app)
            .put(`/orders/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })
  describe('Delete Order', () => {
    describe('DELETE /orders/1', () => {
      describe('Correct requests', () => {
        it('Should return deleted message', (done) => {
          const id = '1'
          request(app)
            .delete(`/orders/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty(
                'message',
                'order successfully deleted'
              )
            })
        })
      })
    })
  })
})
