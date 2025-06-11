const { pool, session } = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getAllUsers = async (req, res) => {
  await pool.query('SELECT * FROM air_book.users', (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      const users = results.rows.map((user) => ({
        userId: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        description: user.description,
        role: user.role,
      }));
      res.status(200).json(users);
    }
  });
};

const getUserIdByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const userQuery = await pool.query('SELECT user_id FROM air_book.users WHERE email = $1', [email]);
    if (userQuery.rows.length > 0) {
      res.json({ userId: userQuery.rows[0].user_id });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userQuery = await pool.query('SELECT * FROM air_book.users WHERE user_id = $1', [userId]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userQuery.rows[0];

    const modifiedUser = {
      userId: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      image: user.image,
      phone: user.phone,
      address: user.address,
      description: user.description,
      role: user.role,
    };
    res.json(modifiedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, image, phone, address, description, role = 'none' } = req.body;

    if (!firstName || !lastName || !email || !password || !image || !phone || !address) {
      return res.status(400).json({
        message: 'firstName, lastName, email, password, image, phone, and address are required.',
      });
    }

    const query = `
      INSERT INTO air_book.users (first_name, last_name, email, password, image, phone, address, description, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING user_id
    `;

    const values = [firstName, lastName, email, password, image, phone, address, description, role];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'User created',
      userId: result.rows[0].user_id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName, email, password, image, phone, address, description, role } = req.body;

    const requiredFields = { firstName, lastName, email, password, image, phone, address };
    const missingFields = Object.entries(requiredFields).filter(([_, val]) => val === null || val === undefined || val === '');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: 'All required fields must be provided and not empty.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      UPDATE air_book.users SET first_name = $1, last_name = $2, email = $3, password = $4, image = $5, phone = $6, address = $7, description = $8, role = $9
      WHERE user_id = $10
      RETURNING *
    `;

    const values = [firstName, lastName, email, hashedPassword, image, phone, address, description, role, userId];

    const result = await pool.query(query, values);
    res.status(200).json({ message: 'User updated', userId: result.rows[0].user_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const patchUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateFields = req.body;

    const fieldMap = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      password: 'password',
      image: 'image',
      phone: 'phone',
      address: 'address',
      description: 'description',
      role: 'role',
    };

    const entries = Object.entries(updateFields)
      .filter(([key, value]) => fieldMap[key] && value !== null && value !== undefined && value !== '')
      .map(([key, value]) => [fieldMap[key], value]);

    if (!entries.length) {
      return res.status(400).json({ message: 'No valid fields to update (null or empty).' });
    }

    for (let i = 0; i < entries.length; i++) {
      if (entries[i][0] === 'password') {
        entries[i][1] = await bcrypt.hash(entries[i][1], 10);
      }
    }

    const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`).join(', ');
    const values = entries.map(([, value]) => value);

    const query = `
      UPDATE air_book.users
      SET ${setClauses}
      WHERE user_id = $${values.length + 1}
      RETURNING *
    `;

    values.push(userId);
    const result = await pool.query(query, values);

    res.status(200).json({ message: 'User patched', userId: userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await pool.query('DELETE FROM air_book.users WHERE user_id = $1 RETURNING *', [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ message: 'userId and message are required.' });
    }
    const result = await pool.query(
      `INSERT INTO air_book.user_notifications (user_id, message) VALUES ($1, $2)
      RETURNING id AS "notificationId", user_id AS "userId", message`,
      [userId, message]
    );
    res.status(201).json({ message: 'Notification created', notification: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authorization token is missing' });

    const { userId, flightId } = req.body;
    if (!userId || !flightId) {
      return res.status(400).json({ message: 'userId and flightId are required' });
    }

    const result = await session.run(
      `
      MATCH (:Airport)-[r:Flight]->(:Airport)
      WHERE r.flight_id = $flightId
      WITH r, r.free_seats AS seats
      CALL apoc.util.validate(seats <= 0, 'No available seats', []) 
      SET r.free_seats = r.free_seats - 1
      RETURN r
      `,
      { flightId: parseInt(flightId) }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const insertResult = await pool.query(
      `INSERT INTO air_book.user_reservations (user_id, flight_id)
       VALUES ($1, $2)
       RETURNING id AS "reservationId", user_id AS "userId", flight_id AS "flightId"`,
      [userId, flightId]
    );

    res.status(201).json({ message: 'Reservation created', reservation: insertResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const deleteReservationById = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authorization token is missing' });

    const reservationId = req.params.reservationId;

    const reservationResult = await pool.query('SELECT flight_id FROM air_book.user_reservations WHERE id = $1', [reservationId]);

    if (reservationResult.rowCount === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const flightId = reservationResult.rows[0].flight_id;

    await pool.query('DELETE FROM air_book.user_reservations WHERE id = $1', [reservationId]);

    const result = await session.run(
      `
      MATCH (:Airport)-[r:Flight]->(:Airport)
      WHERE r.flight_id = $flightId
      SET r.free_seats = r.free_seats + 1
      RETURN r
      `,
      { flightId: parseInt(flightId) }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.status(200).json({ message: 'Reservation deleted and seat released' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const dbResult = await pool.query(`SELECT message FROM air_book.user_notifications WHERE user_id=$1`, [userId]);

    if (dbResult.rowCount == 0) {
      return res.json([]);
    }

    res.status(200).json(dbResult.rows.map((row) => row.message));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserIdByEmail,
  getUserById,
  createNewUser,
  updateUserById,
  patchUserById,
  deleteUserById,
  createNotification,
  createReservation,
  deleteReservationById,
  getNotificationsByUserId,
};
