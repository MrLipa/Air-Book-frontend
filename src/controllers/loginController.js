const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ code: 400, message: 'Email and password are required.' });
  }

  try {
    const [foundUserQuery] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (foundUserQuery.length === 0) {
      return res.status(401).json({ code: 401, message: 'Invalid email or password.' });
    }

    const user = foundUserQuery[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ code: 401, message: 'Invalid email or password.' });
    }

    const payload = {
      userInfo: {
        userId: user.id,
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

    const [existingToken] = await pool.execute('SELECT * FROM tokens WHERE user_id = ?', [user.id]);

    if (existingToken.length === 0) {
      await pool.execute('INSERT INTO tokens (id, user_id, refresh_token) VALUES (UUID(), ?, ?)', [user.id, refreshToken]);
    } else {
      await pool.execute('UPDATE tokens SET refresh_token = ? WHERE user_id = ?', [refreshToken, user.id]);
    }

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE),
    });

    return res.status(200).json({
      code: 200,
      message: 'Login successful.',
      accessToken,
      userId: user.id,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message || 'Internal server error.' });
  }
};

module.exports = {
  loginUser,
};
