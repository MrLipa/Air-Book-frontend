import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import pkg from '../utils/generateToken.js';
const { generateAccessToken } = pkg;

const adminToken = generateAccessToken({
  userId: 1,
  email: 'admin@example.com',
  role: 'admin',
});

const userToken = generateAccessToken({
  userId: 2,
  email: 'user@example.com',
  role: 'user',
});

describe('User endpoints', () => {
  describe('GET /user/getAllUsers', () => {
    it('should return a list of users for admin', async () => {
      const res = await request(app)
        .get('/user/getAllUsers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 403 for non-admin', async () => {
      const res = await request(app)
        .get('/user/getAllUsers')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('GET /user/getUserIdByEmail/:email', () => {
    it('should return userId for existing email', async () => {
      const res = await request(app)
        .get('/user/getUserIdByEmail/xavier@gmail.com')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body).to.have.property('userId');
    });

    it('should return 404 for unknown email', async () => {
      await request(app)
        .get('/user/getUserIdByEmail/unknown@example.com')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('GET /user/getUserById/:userId', () => {
    it('should return user details', async () => {
      const res = await request(app)
        .get('/user/getUserById/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body).to.have.property('userId', 1);
    });

    it('should return 404 for non-existing user', async () => {
      await request(app)
        .get('/user/getUserById/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /user/createNewUser', () => {
    const newUser = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.smith@example.com',
      password: 'securePass456',
      image: 'avatar.jpg',
      phone: '987654321',
      address: '456 Avenue',
      description: 'test user for endpoints',
    };

    it('should create a new user', async () => {
      const res = await request(app)
        .post('/user/createNewUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser)
        .expect(201);
      expect(res.body).to.have.property('userId');
    });

    it('should return 400 if required fields missing', async () => {
      const badUser = { ...newUser };
      delete badUser.email;

      await request(app)
        .post('/user/createNewUser')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(badUser)
        .expect(400);
    });
  });

  describe('PUT /user/updateUserById/:userId', () => {
    it('should update user details', async () => {
      const updated = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
        password: 'newpass',
        image: 'img.jpg',
        phone: '987654321',
        address: 'Updated Street',
        description: 'Updated desc',
        role: 'user',
      };
      const res = await request(app)
        .put('/user/updateUserById/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updated)
        .expect(200);
      expect(res.body).to.have.property('message', 'User updated');
    });

    it('should return 400 if fields are empty', async () => {
      await request(app)
        .put('/user/updateUserById/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('PATCH /user/patchUserById/:userId', () => {
    it('should patch user details', async () => {
      await request(app)
        .patch('/user/patchUserById/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ description: 'patched' })
        .expect(200);
    });

    it('should return 400 if no valid fields', async () => {
      await request(app)
        .patch('/user/patchUserById/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /user/deleteUserById/:userId', () => {
    it('should delete a user', async () => {
      const res = await request(app)
        .delete('/user/deleteUserById/2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body).to.have.property('message', 'User deleted');
    });

    it('should return 404 if user not found', async () => {
      await request(app)
        .delete('/user/deleteUserById/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /user/createNotification', () => {
    it('should create a notification', async () => {
      const res = await request(app)
        .post('/user/createNotification')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: 1, message: 'Hello' })
        .expect(201);
      expect(res.body).to.have.property('notification');
    });
  });

  describe('POST /user/createReservation', () => {
    it('should create a reservation', async () => {
      const res = await request(app)
        .post('/user/createReservation')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: 1, flightId: 1 })
        .expect(201);
      expect(res.body).to.have.property('reservation');
    });

    it('should return 400 if required fields missing', async () => {
      await request(app)
        .post('/user/createReservation')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userId: 2 })
        .expect(400);
    });
  });

  describe('DELETE /user/deleteReservationById/:reservationId', () => {
    it('should delete a reservation', async () => {
      const res = await request(app)
        .delete('/user/deleteReservationById/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.message).to.include('Reservation deleted');
    });

    it('should return 404 if reservation not found', async () => {
      await request(app)
        .delete('/user/deleteReservationById/9999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('GET /user/getNotificationsByUserId/:userId', () => {
    it('should return user notifications', async () => {
      const res = await request(app)
        .get('/user/getNotificationsByUserId/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 400 if userId is invalid', async () => {
      await request(app)
        .get('/user/getNotificationsByUserId/abc')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });
  });
});
