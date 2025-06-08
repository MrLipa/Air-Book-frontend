const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    const foundUser = await pool.query(
      `SELECT u.* FROM air_book.users u
       JOIN air_book.user_tokens t ON u.user_id = t.user_id
       WHERE t.refresh_token = $1 AND u.email = $2`,
      [refreshToken, decoded.userInfo.email]
    );

    if (foundUser.rows.length === 0) {
      return res.status(403).json({ message: 'User not found' });
    }

    const user = foundUser.rows[0];

    const newAccessToken = jwt.sign(
      {
        userInfo: {
          userId: user.user_id,
          email: user.email,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.json({
      accessToken: newAccessToken,
      userId: user.user_id,
      role: user.role,
    });
  });
};

module.exports = {
  refreshToken,
};
