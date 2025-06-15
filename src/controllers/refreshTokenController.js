const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'No JWT cookie provided' });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    try {
      const [foundUser] = await pool.execute(
        `SELECT u.* FROM users u
         JOIN tokens t ON u.id = t.user_id
         WHERE t.refresh_token = ? AND u.email = ?`,
        [refreshToken, decoded.userInfo.email]
      );

      if (foundUser.length === 0) {
        return res.status(403).json({ message: 'User not found' });
      }

      const user = foundUser[0];

      const newAccessToken = jwt.sign(
        {
          userInfo: {
            userId: user.id,
            email: user.email,
            role: user.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      return res.status(200).json({
        code: 200,
        message: 'Access token refreshed successfully',
        accessToken: newAccessToken,
        userId: user.id,
        role: user.role,
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        message: err.message || 'Internal server error'
      });
    }
  });
};

module.exports = {
  refreshToken,
};
