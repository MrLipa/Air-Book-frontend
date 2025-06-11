const { pool, session } = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const getAllUsers = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM users');
    
    const users = results.map((user) => ({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserIdByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const [userQuery] = await pool.execute('SELECT user_id FROM users WHERE email = ?', [email]);
    if (userQuery.length > 0) {
      res.json({ userId: userQuery[0].user_id });
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
    const [userQuery] = await pool.execute('SELECT * FROM users WHERE user_id = ?', [userId]);

    if (userQuery.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userQuery[0];

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
      INSERT INTO users (first_name, last_name, email, password, image, phone, address, description, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [firstName, lastName, email, password, image, phone, address, description, role];

    const [result] = await pool.execute(query, values);

    res.status(201).json({
      message: 'User created',
      userId: result.insertId,
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
      UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, image = ?, phone = ?, address = ?, description = ?, role = ?
      WHERE user_id = ?
    `;

    const values = [firstName, lastName, email, hashedPassword, image, phone, address, description, role, userId];

    const [result] = await pool.execute(query, values);
    res.status(200).json({ message: 'User updated', userId: result.insertId });
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

    const setClauses = entries.map(([key], i) => `${key} = ?`).join(', ');
    const values = entries.map(([, value]) => value);

    const query = `
      UPDATE users
      SET ${setClauses}
      WHERE user_id = ?
    `;

    values.push(userId);
    const [result] = await pool.execute(query, values);

    res.status(200).json({ message: 'User patched', userId: userId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const [result] = await pool.execute('DELETE FROM users WHERE user_id = ?', [userId]);
    if (result.affectedRows === 0) {
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
    const [result] = await pool.execute(
      `INSERT INTO user_notifications (user_id, message) VALUES (?, ?)`,
      [userId, message]
    );
    res.status(201).json({ message: 'Notification created', notification: result });
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

    const [result] = await pool.execute(
      `INSERT INTO user_reservations (user_id, flight_id) VALUES (?, ?)`,
      [userId, flightId]
    );

    res.status(201).json({ message: 'Reservation created', reservation: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteReservationById = async (req, res) => {
  try {
    const reservationId = req.params.reservationId;
    const [reservationResult] = await pool.execute('SELECT flight_id FROM user_reservations WHERE id = ?', [reservationId]);

    if (reservationResult.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const flightId = reservationResult[0].flight_id;

    await pool.execute('DELETE FROM user_reservations WHERE id = ?', [reservationId]);

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

    const [dbResult] = await pool.execute('SELECT message FROM user_notifications WHERE user_id = ?', [userId]);

    if (dbResult.length === 0) {
      return res.json([]);
    }

    res.status(200).json(dbResult.map((row) => row.message));
  } catch (err) {
    res.status(500).json({ message: err.message });
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
