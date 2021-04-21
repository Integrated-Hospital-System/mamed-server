require('dotenv').config()
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const connection = require('../helpers/db-connection')
const { Admin, Doctor, Patient } = require('../models/account')
const { Appointment } = require('../models/appointment')
const { Medicine } = require('../models/medicine')

const admin = {
  name: 'Admin',
  email: 'admin@email.com',
  password: 'test1234',
}

const patient = {
  name: 'Jack',
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

const medicine = {
  name: 'panadol',
  stock: '4000',
  description: 'effective for headache',
}
const medicine2 = {
  name: 'sakatonik',
  stock: '1000',
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
  const addMedicine = async () => {
    const objMedicine = await new Medicine(medicine)
    const objMedicine2 = await new Medicine(medicine2)
    tester.medicine = { id: objMedicine._id }
    tester.medicine2 = { id: objMedicine2._id }
    await objMedicine.save()
    await objMedicine2.save()
  }
  const addAppointment = async () => {
    const objAppointment = await new Appointment({
      appointmentDate: '2021-04-25T19:37:40+0700',
      doctor: tester.doctor.id,
      patient: tester.patient.id,
    }).save()
    const objAppointment2 = await new Appointment({
      appointmentDate: '2021-04-26T19:37:40+0700',
      doctor: tester.doctor.id,
      patient: tester.patient.id,
    }).save()
    tester.appointment = { id: objAppointment._id }
    tester.appointment2 = { id: objAppointment2._id }
  }

  const resetDB = async () => {
    await mongoose.connect(connection.getDBName(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await mongoose.connection.db.dropDatabase(connection.getDBName())
    await Promise.all([addAdmin(), addDoctor(), addPatient(), addMedicine()])
    await addAppointment()
    done()
  }
  resetDB()
})

describe('Order', () => {
  describe('Create Order', () => {
    describe('POST /orders/:appointmentId', () => {
      describe('Correct request(s)', () => {
        it('Should return newly created order', async (done) => {
          const medicines = [
            {
              medicineId: tester.medicine.id.toString(),
              timesPerDay: 2,
              doses: 3,
              totalMedicine: 5,
            },
            {
              medicineId: tester.medicine2.id.toString(),
              timesPerDay: 3,
              doses: 1,
              totalMedicine: 8,
            },
          ]
          const diseases = ['migraine', 'back pain']
          const id = tester.appointment.id.toString()
          const body = { medicines, diseases }
          const { access_token } = tester.doctor
          const res = await request(app)
            .post(`/orders/${id}`)
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(201)
          expect(res.body.medicines[1].medicine).toBe(medicines[1].medicineId)
          expect(res.body).toHaveProperty('diseases', diseases)
          done()
        })
        it('Should return update the appointment completion status', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.doctor
          const res = await request(app)
            .get(`/appointments/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('isCompleted', true)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating cannot recreate order', async (done) => {
          const medicines = [
            {
              medicineId: tester.medicine.id.toString(),
              timesPerDay: 2,
              doses: 3,
              totalMedicine: 5,
            },
            {
              medicineId: tester.medicine2.id.toString(),
              timesPerDay: 3,
              doses: 1,
              totalMedicine: 8,
            },
          ]
          const diseases = ['migraine', 'back pain']
          const id = tester.appointment.id.toString()
          const body = { medicines, diseases }
          const { access_token } = tester.doctor
          const res = await request(app)
            .post(`/orders/${id}`)
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(400)
          expect(res.body).toHaveProperty('message', [
            'Cannot re-create order, use update instead!',
          ])
          done()
        })
        it('Should return error indicating patient cannot create order', async (done) => {
          const medicines = [
            {
              medicineId: tester.medicine.id.toString(),
              timesPerDay: 2,
              doses: 3,
              totalMedicine: 5,
            },
            {
              medicineId: tester.medicine2.id.toString(),
              timesPerDay: 3,
              doses: 1,
              totalMedicine: 8,
            },
          ]
          const diseases = ['migraine', 'back pain']
          const id = tester.appointment.id.toString()
          const body = { medicines, diseases }
          console.log(id, ',,, appoinmt id')
          const { access_token } = tester.patient
          const res = await request(app)
            .post(`/orders/${id}`)
            .send(body)
            .set({ access_token })
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })
  describe('Read All Orders', () => {
    describe('GET /orders', () => {
      describe('Correct request(s)', () => {
        it('Should return order(s) associated with doctor', async (done) => {
          const { access_token } = tester.doctor
          const res = await request(app).get('/orders').set({ access_token })
          expect(res.status).toBe(200)
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body[0]).toHaveProperty('_id')
          done()
        })
        it('Should return order(s) associated with doctor', async (done) => {
          const { access_token } = tester.patient
          const res = await request(app).get('/orders').set({ access_token })
          expect(res.status).toBe(200)
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body[0]).toHaveProperty('_id')

          done()
        })
        it('Should return empty array indicating the signed in doctor doesnt have any orders', async (done) => {
          const { access_token } = tester.doctor2
          const res = await request(app).get('/orders').set({ access_token })
          expect(res.status).toBe(200)
          expect(Array.isArray(res.body)).toBe(true)
          expect(res.body.length).toBe(0)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating access_token is required', async (done) => {
          const res = await request(app).get('/orders')
          expect(res.status).toBe(401)
          done()
        })
      })
    })
  })

  describe('Read One Order', () => {
    describe('GET /orders/:appointmentId', () => {
      describe('Correct request(s)', () => {
        it('Should return one order associated with signed in patient', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.patient

          const expectedPatient = { ...patient }
          delete expectedPatient.password
          const expectedDoctor = { ...doctor }
          delete expectedDoctor.password
          const expectedMedicine = { ...medicine, stock: medicine.stock - 5 }
          const res = await request(app)
            .get(`/orders/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.appointment).toHaveProperty('_id', id)
          expect(res.body.appointment.patient).toMatchObject(expectedPatient)
          expect(res.body.appointment.doctor).toMatchObject(expectedDoctor)
          expect(res.body.medicines[0].medicine).toMatchObject(expectedMedicine)
          done()
        })
        it('Should return one order associated with signed in doctor', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.doctor

          const expectedPatient = { ...patient }
          delete expectedPatient.password
          const expectedDoctor = { ...doctor }
          delete expectedDoctor.password
          const expectedMedicine = { ...medicine, stock: medicine.stock - 5 }
          const res = await request(app)
            .get(`/orders/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body.appointment).toHaveProperty('_id', id)
          expect(res.body.appointment.patient).toMatchObject(expectedPatient)
          expect(res.body.appointment.doctor).toMatchObject(expectedDoctor)
          expect(res.body.medicines[0].medicine).toMatchObject(expectedMedicine)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating order accessed by non authenticated account', async (done) => {
          const id = tester.appointment.id.toString()
          const res = await request(app).get(`/orders/${id}`)
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message', ['user not authenticated'])
          done()
        })
        it('Should return error indicating order accessed by non authorized account', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.doctor2
          const res = await request(app)
            .get(`/orders/${id}`)
            .set({ access_token })
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message', ['user not authorized'])
          done()
        })
      })
    })
  })

  describe('Update Order', () => {
    describe('PUT /orders/:appointmentId', () => {
      describe('Correct request(s)', () => {
        it('Should return one updated order', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.doctor
          const diseases = ['covid-19']
          const medicineId = tester.medicine.id.toString()
          const res = await request(app)
            .put(`/orders/${id}`)
            .set({ access_token })
            .send({ diseases })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty('appointment')
          expect(res.body).toHaveProperty('diseases', diseases)
          expect(res.body.medicines[0]).toHaveProperty('medicine', medicineId)
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        // tinggal ini doang
        it('Should return error indicating order accessed by non authenticated account', async (done) => {
          const id = tester.appointment.id.toString()
          const diseases = ['covid-19']
          const res = await request(app).put(`/orders/${id}`).send({ diseases })
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message', ['user not authenticated'])
          done()
        })
        it('Should return error indicating order accessed by non authorized account', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.doctor2
          const diseases = ['covid-19']
          const res = await request(app)
            .put(`/orders/${id}`)
            .send({ diseases })
            .set({ access_token })
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message', ['user not authorized'])
          done()
        })
      })
    })
  })
  describe('Delete Order', () => {
    describe('DELETE /orders/:appointmentId', () => {
      describe('Correct request(s)', () => {
        it('Should return deleted message', async (done) => {
          const id = tester.appointment.id.toString()
          const { access_token } = tester.doctor
          const res = await request(app)
            .delete(`/orders/${id}`)
            .set({ access_token })
          expect(res.status).toBe(200)
          expect(res.body).toHaveProperty(
            'message',
            'Order successfully deleted'
          )
          done()
        })
      })
      describe('Incorrect request(s)', () => {
        it('Should return error indicating order accessed by non authenticated account', async (done) => {
          const id = tester.appointment2.id.toString()
          const res = await request(app).delete(`/orders/${id}`)
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message', ['user not authenticated'])
          done()
        })
        it('Should return error indicating order accessed by non authorized account', async (done) => {
          const id = tester.appointment2.id.toString()
          const { access_token } = tester.patient
          const res = await request(app)
            .delete(`/orders/${id}`)
            .set({ access_token })
          expect(res.status).toBe(401)
          expect(res.body).toHaveProperty('message', ['user not authorized'])
          done()
        })
      })
    })
  })
})
