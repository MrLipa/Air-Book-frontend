const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required.' });

  const foundUserQuery = await pool.query('SELECT * FROM air_book.users WHERE email = $1', [email]);

  if (foundUserQuery.rows.length === 0) return res.sendStatus(401);

  const user = foundUserQuery.rows[0];

  try {
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.sendStatus(401);

    const payload = {
      userInfo: {
        userId: user.user_id,
        email: user.email,
        role: user.role,
      },
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    const existingToken = await pool.query(
      'SELECT * FROM air_book.user_tokens WHERE user_id = $1',
      [user.user_id]
    );

    if (existingToken.rows.length === 0) {
      await pool.query(
        'INSERT INTO air_book.user_tokens (user_id, refresh_token) VALUES ($1, $2)',
        [user.user_id, refreshToken]
      );
    } else {
      await pool.query('UPDATE air_book.user_tokens SET refresh_token = $2 WHERE user_id = $1', [
        user.user_id,
        refreshToken,
      ]);
    }

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE),
    });

    res.json({
      accessToken,
      userId: user.user_id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  loginUser,
};
