const request = require('supertest')
const app = require('../app')

describe('Order', () => {
  describe('Create Order', () => {
    describe('POST /orders', () => {
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
