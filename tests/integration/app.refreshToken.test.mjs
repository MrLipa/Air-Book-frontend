import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import app from '../../app.js';
import { pool } from '../../config/db.js';

describe('GET /refreshToken', () => {
  let refreshToken;
  const userId = 1;

  before(async () => {
    await pool.query('DELETE FROM user_tokens WHERE user_id = $1', [userId]);

    const payload = {
      userInfo: {
        userId,
        email: 'xavier@gmail.com',
        role: 'admin',
      },
    };

    refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    });

    await pool.query('INSERT INTO user_tokens (user_id, refresh_token) VALUES ($1, $2)', [userId, refreshToken]);
  });

  after(async () => {
    try {
      if (refreshToken) {
        await pool.query('DELETE FROM user_tokens WHERE refresh_token = $1', [refreshToken]);
      }
    } catch (err) {
      console.error('[AFTER] Cleanup error:', err.message);
    }
  });

  it('✅ should return new access token for valid refresh token', async () => {
    const res = await request(app)
      .get('/refreshToken')
      .set('Cookie', [`jwt=${refreshToken}`]);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('accessToken');
    expect(res.body).to.have.property('userId');
    expect(res.body).to.have.property('role');
  });

  it('❌ should return 401 if no cookie is present', async () => {
    const res = await request(app).get('/refreshToken');
    expect(res.status).to.equal(401);
  });

  it('❌ should return 403 if token is invalid', async () => {
    const res = await request(app).get('/refreshToken').set('Cookie', ['jwt=invalid_token_value']);

    expect(res.status).to.equal(403);
  });

  it('❌ should return 403 if user not found in DB', async () => {
    const fakePayload = {
      userInfo: {
        userId: 9999999,
        email: 'nonexistent@example.com',
        role: 'user',
      },
    };

    const fakeToken = jwt.sign(fakePayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1h',
    });

    const res = await request(app)
      .get('/refreshToken')
      .set('Cookie', [`jwt=${fakeToken}`]);

    expect(res.status).to.equal(403);
    expect(res.body.message).to.equal('User not found');
  });
});
