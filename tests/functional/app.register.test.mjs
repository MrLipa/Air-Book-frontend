import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';

describe('POST /register', () => {
  const userData = {
    firstName: "Anna",
    lastName: "Kowalska",
    email: "anna.kowalska@example.com",
    password: "StrongPass123!",
    role: "admin"
  };

  it('✅ should register a new user and return 201', async () => {
    const res = await request(app).post('/register').send(userData);
    expect(res.status).to.equal(201);
    expect(res.body.message).to.include(userData.email);
  });

  it('❌ should return 409 if user with email already exists', async () => {
    const res = await request(app).post('/register').send(userData);
    expect(res.status).to.equal(409);
    expect(res.body.message).to.equal('User with this email already exists.');
  });

  it('❌ should return 400 if fields are missing', async () => {
    const res = await request(app).post('/register').send({
      email: 'missing@example.com',
      password: 'Test123!'
    });
    expect(res.status).to.equal(400);
    expect(res.body.message).to.include('"firstName" is required'); // zakładamy, że używasz Joi lub podobnej walidacji
  });
});
