require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const connection = require('../helpers/db-connection')
const { Admin, Doctor, Patient } = require('../models/account')

const admin = {
  name: 'Admin',
  email: 'admin@email.com',
  password: 'test1234',
}

const patient = {
  name: 'Jack',
  username: 'jack',
  password: 'pass1234',
  email: 'jack@jack.com',
  comorbid: ['high blood pressure', 'anemia'],
  age: 28,
  gender: 'male',
}
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
const doctor = {
  name: 'Razza',
  password: 'pass1234',
  role: 'Doctor',
  email: 'razza@doctor.com',
  speciality: ['tht', 'organ dalam'],
  practice: [practice0, practice1],
}

const doctor2 = {
  name: 'Motred',
  password: 'pass1234',
  role: 'Doctor',
  email: 'motred@doctor.com',
  speciality: ['bedah', 'organ dalam'],
}

const tester = {}

beforeAll((done) => {
  const addAdmin = async () => {
    const { _id } = await new Admin(admin).save()
    const res = await request(app).post('/login').send(admin)
    tester.admin = { id: _id, access_token: res.body.access_token }
  }
  const addDoctor = async () => {
    const { _id } = await new Doctor(doctor).save()
    const res = await request(app).post('/login').send(doctor)
    tester.doctor = { id: _id, access_token: res.body.access_token }

    const { _id: _id2 } = await new Doctor(doctor2).save()
    const res2 = await request(app).post('/login').send(doctor2)
    tester.doctor2 = { id: _id2, access_token: res2.body.access_token }
  }
  const addPatient = async () => {
    const { _id } = await new Patient(patient).save()
    const res = await request(app).post('/login').send(patient)
    tester.patient = { id: _id, access_token: res.body.access_token }
  }
  const resetDB = async () => {
    await mongoose.connect(connection.getDBName(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await mongoose.connection.db.dropDatabase(connection.getDBName())
    await Promise.all([addAdmin(), addDoctor(), addPatient()])
    done()
  }
  resetDB()
})

describe('Appointment', () => {
  describe('Create Appointment', () => {
    describe('POST /appointments', () => {
      describe('Correct request(s)', () => {
        it('Should return patient created appointment', async (done) => {
          const body = {
            doctorId: tester.doctor.id.toString(),
            patientId: tester.patient.id.toString(),
            appointmentDate: '2021/04/21',
          }
          const res = await request(app)
            .post('/appointments')
            .send(body)
            .set({ access_token: tester.patient.access_token })

          expect(res.status).toBe(201)
          expect(res.body).toHaveProperty('_id')
          expect(res.body).toHaveProperty('doctor')
          expect(res.body).toHaveProperty('patient')
          expect(res.body).toHaveProperty('appointmentDate')
          expect(res.body).toHaveProperty('isCompleted', false)
          tester.appointment = { id: res.body._id }
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating doctor cannot create appointment', async (done) => {
          const body = {
            doctorId: tester.doctor.id.toString(),
            patientId: tester.patient.id.toString(),
            appointmentDate: '2021/04/21',
          }
          const res = await request(app)
            .post('/appointments')
            .send(body)
            .set({ access_token: tester.doctor.access_token })

          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
  describe('Read All Appointments', () => {
    describe('GET /appointments', () => {
      describe('Correct request(s)', () => {
        it('Should return appoinement(s) associated with signed in doctor', async (done) => {
          const { access_token } = tester.doctor
          const res = await request(app)
            .get('/appointments')
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.length).toBe(1)
          done()
        })
        it('Should return appoinement(s) associated with signed in patient', async (done) => {
          const { access_token } = tester.patient
          const res = await request(app)
            .get('/appointments')
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.length).toBe(1)
          done()
        })
        it('Should return empty array indicating the signed in doctor doesnt have any appointment', async (done) => {
          const { access_token } = tester.doctor2
          const res = await request(app)
            .get('/appointments')
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.length).toBe(0)
          done()
        })
      })
    })
  })
  describe('Read One Appointment', () => {
    describe('GET /appointments/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return one appointment associated with signed in patient', async (done) => {
          const { access_token } = tester.patient
          const patientId = tester.patient.id.toString()
          const doctorId = tester.doctor.id.toString()
          const id = tester.appointment.id.toString()
          const res = await request(app)
            .get(`/appointments/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('_id', id)
          expect(res.body).toHaveProperty('patient', patientId)
          expect(res.body).toHaveProperty('doctor', doctorId)
          done()
        })
        it('Should return one appointment associated with signed in doctor', async (done) => {
          const { access_token } = tester.doctor
          const patientId = tester.patient.id.toString()
          const doctorId = tester.doctor.id.toString()
          const id = tester.appointment.id.toString()
          const res = await request(app)
            .get(`/appointments/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('_id', id)
          expect(res.body).toHaveProperty('patient', patientId)
          expect(res.body).toHaveProperty('doctor', doctorId)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const id = tester.appointment.id.toString()
          const res = await request(app).get(`/appointments/${id}`)
          expect(res.status).toBe(401)
          done()
        })
        it('Should return error indicating doctor cannot access another doctor appointment', async (done) => {
          const { access_token } = tester.doctor2
          const id = tester.appointment.id.toString()
          const res = await request(app)
            .get(`/appointments/${id}`)
            .set({ access_token })
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
  describe('Update Appointment', () => {
    describe('PUT /appointments/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return one updated appointment', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.admin
          const body = { doctor: tester.doctor2.id }
          const res = await request(app)
            .put(`/appointments/${id}`)
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty(
            'doctor',
            tester.doctor2.id.toString()
          )
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const id = tester.appointment.id.toString()
          const body = { doctor: tester.doctor2.id }
          const res = await request(app).put(`/appointments/${id}`).send(body)

          expect(res.status).toBe(401)
          done()
        })
      })
    })
    describe('PATCH /appointments/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return one updated appointment', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.admin
          const body = { isCompleted: true }
          const res = await request(app)
            .patch(`/appointments/${id}`)
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty(
            'doctor',
            tester.doctor2.id.toString()
          )
          done()
        })
      })
      describe('Inorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const id = tester.appointment.id.toString()
          const body = { isCompleted: true }
          const res = await request(app).patch(`/appointments/${id}`).send(body)
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
  describe('Delete Appointment', () => {
    describe('DELETE /appointments/:id', () => {
      describe('Correct request(s)', () => {
        it('Should return deleted message', async (done) => {
          const { access_token } = tester.doctor2
          const id = tester.appointment.id.toString()
          const res = await request(app)
            .delete(`/appointments/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty(
            'message',
            'Appointment successfully deleted'
          )
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating only associated doctor may delete the appointment', async (done) => {
          const { access_token } = tester.patient
          const body = {
            doctorId: tester.doctor.id.toString(),
            patientId: tester.patient.id.toString(),
            appointmentDate: '2021/04/22',
          }
          const newAppointment = await request(app)
            .post('/appointments')
            .send(body)
            .set({ access_token })
          const id = newAppointment.body._id

          const res = await request(app)
            .delete(`/appointments/${id}`)
            .set({ access_token: tester.doctor2.id.toString() })
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
})
