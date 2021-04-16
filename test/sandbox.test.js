const request = require('supertest')
const app = require('../app')

describe('Sandbox', () => {
  it('Should work!', (done) => {
    request(app)
      .get('/sandbox')
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message', 'hello sandbox')
        done()
      })
  })
})
