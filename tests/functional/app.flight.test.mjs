import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import pkg from '../utils/generateToken.js';
const { generateAccessToken } = pkg;

const token = generateAccessToken({
  userId: 1,
  email: 'admin@example.com',
  role: 'admin',
});

describe('Flight Routes', () => {
  describe('GET /flight/getAllFlights', () => {
    it('should return all flights with 200', async () => {
      const res = await request(app)
        .get('/flight/getAllFlights')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 403 if no token is provided', async () => {
      const res = await request(app).get('/flight/getAllFlights');
      expect(res.status).to.equal(403);
    });
  });

  describe('POST /flight/searchFlights', () => {
    it('should return flights from a city', async () => {
      const res = await request(app)
        .post('/flight/searchFlights')
        .send({ cityFrom: 'Warsaw' });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return flights to a city', async () => {
      const res = await request(app)
        .post('/flight/searchFlights')
        .send({ cityTo: 'London' });

      expect(res.status).to.equal(200);
    });
  });

  describe('POST /flight/getFlightsByIds', () => {
    it('should return flights for given IDs', async function () {
      this.timeout(5000);

      const res = await request(app)
        .post('/flight/getFlightsByIds')
        .set('Authorization', `Bearer ${token}`)
        .send({ flightIds: [1] });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /flight/getFlightsByUserId/:userId', () => {
    it('should return user reservations and flights', async function () {
      this.timeout(15000);

      const res = await request(app)
        .get('/flight/getFlightsByUserId/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 400 for invalid userId', async () => {
      const res = await request(app)
        .get('/flight/getFlightsByUserId/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
    });
  });

  describe('PATCH /flight/patchFlightById/:flightId', () => {
    it('should patch flight fields and return 200', async () => {
      const res = await request(app)
        .patch('/flight/patchFlightById/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ price: 999 });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
    });
  });
});
