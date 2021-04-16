const request = require('supertest')
const app = require('../app')

describe('Appointment', () => {
  describe('Create Appointment', () => {
    describe('POST /appointments', () => {
      describe('Correct requests', () => {
        it('Should create one appointment', (done) => {
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
  describe('Read All Appointments', () => {
    describe('GET /appointments', () => {
      describe('Correct requests', () => {
        it('Should return one appointment', (done) => {
          const id = '1'
          request(app)
            .get(`/appointments/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })

  describe('Read One Appointment', () => {
    describe('GET /appointments/1', () => {
      describe('Correct requests', () => {
        it('Should return one appointment', (done) => {
          const id = '1'
          request(app)
            .get(`/appointments/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })

  describe('Update Appointment', () => {
    describe('PUT /appointments/1', () => {
      describe('Correct requests', () => {
        it('Should return one updated appointment', (done) => {
          const id = '1'
          request(app)
            .put(`/appointments/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty('id', id)
            })
        })
      })
    })
  })
  describe('Delete Appointment', () => {
    describe('DELETE /appointments/1', () => {
      describe('Correct requests', () => {
        it('Should return deleted message', (done) => {
          const id = '1'
          request(app)
            .delete(`/appointments/1/${id}`)
            .end((err, res) => {
              expect(res.status).toBe(200)
              expect(res.body).toHaveProperty(
                'message',
                'appointment successfully deleted'
              )
            })
        })
      })
    })
  })
})
