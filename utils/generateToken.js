const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken(userPayload) {
  return jwt.sign(
    { userInfo: userPayload },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
}

module.exports = { generateAccessToken };
