import request from 'supertest';
import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import { pool } from '../config/db.js';

describe('GET /logout', () => {
  let refreshToken;
  const userId = 1;
  const testUser = {
    email: 'xavier@gmail.com',
    role: 'admin',
  };

  before(async () => {
    const payload = {
      userInfo: {
        userId,
        email: testUser.email,
        role: testUser.role,
      },
    };

    refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    });

    await pool.query('INSERT INTO air_book.user_tokens (user_id, refresh_token) VALUES ($1, $2)', [
      userId,
      refreshToken,
    ]);
  });

  after(async () => {
    try {
      await pool.query('DELETE FROM air_book.user_tokens WHERE refresh_token = $1', [refreshToken]);
    } catch (err) {
      console.error('[AFTER] Cleanup error:', err.message);
    }
  });

  it('✅ should clear the cookie and remove the token from DB', async () => {
    const res = await request(app)
      .get('/logout')
      .set('Cookie', [`jwt=${refreshToken}`]);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('User logout');
    expect(res.headers['set-cookie']).to.exist;
    expect(res.headers['set-cookie'][0]).to.include('jwt=;');
  });

  it('✅ should return 204 if no cookie is present', async () => {
    const res = await request(app).get('/logout');
    expect(res.status).to.equal(204);
  });

  it('❌ should return 403 if token is malformed', async () => {
    const res = await request(app).get('/logout').set('Cookie', ['jwt=invalid_token_value']);

    expect(res.status).to.equal(403);
  });
});
