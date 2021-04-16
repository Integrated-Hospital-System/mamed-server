const request = require('supertest')
const app = require('../app')

describe('Appointment', () => {
  describe('Create Appointment', () => {
    describe('POST /appointments', () => {
      describe('Correct requests', () => {
        const body = {
          doctorId: '1',
          patientId: '1',
          appointmentDate: '19/04/2021 20:21',
        }

        request(app)
          .post('/appointments')
          .send(body)
          .end((err, res) => {
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('doctor')
            expect(res.body).toHaveProperty('patient')
            expect(res.body).toHaveProperty('appointmentDate')
            expect(res.body).toHaveProperty('isCompleted', false)
            done()
          })
      })
    })
  })
})
