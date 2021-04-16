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
        ],
      }
    })
  })
})
