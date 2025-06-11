const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  try {
    const [foundUserQuery] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (foundUserQuery.length === 0) return res.sendStatus(401);

    const user = foundUserQuery[0];

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

    const [existingToken] = await pool.execute('SELECT * FROM user_tokens WHERE user_id = ?', [user.user_id]);

    if (existingToken.length === 0) {
      await pool.execute('INSERT INTO user_tokens (user_id, refresh_token) VALUES (?, ?)', [user.user_id, refreshToken]);
    } else {
      await pool.execute('UPDATE user_tokens SET refresh_token = ? WHERE user_id = ?', [refreshToken, user.user_id]);
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
