const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const FACEBOOK_CLIENT_ID = "481981307523758";
const FACEBOOK_CLIENT_SECRET = "b98c2c23b899d4f74c6234be9c6433ca";
const REDIRECT_URI = "http://localhost:3000/api/auth/facebook/callback";
const FRONTEND_URL = "http://localhost:5173";

const facebookCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect(`${FRONTEND_URL}/oauth-fail?reason=missing_code`);

  try {
    const tokenResp = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`
    );
    const tokenData = await tokenResp.json();
    if (!tokenData.access_token) return res.redirect(`${FRONTEND_URL}/oauth-fail?reason=token_error`);

    const userResp = await fetch(
      `https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token=${tokenData.access_token}`
    );
    const userData = await userResp.json();
    if (!userData.email) return res.redirect(`${FRONTEND_URL}/oauth-fail?reason=no_email`);

    const [foundUserQuery] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [userData.email]
    );

    let user;
    if (foundUserQuery.length === 0) {
      const userId = crypto.randomUUID();
      const fakePassword = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO users 
         (id, first_name, last_name, email, password, role) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userData.first_name || "Facebook",
          userData.last_name || "User",
          userData.email,
          fakePassword,
          'user'
        ]
      );
      user = { id: userId, email: userData.email, role: 'user' };
    } else {
      user = foundUserQuery[0];
    }

    const payload = {
      userInfo: {
        userId: user.id,
        email: user.email,
        role: user.role,
      }
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    const [existingToken] = await pool.execute('SELECT * FROM tokens WHERE user_id = ?', [user.id]);
    if (existingToken.length === 0) {
      await pool.execute(
        'INSERT INTO tokens (id, user_id, refresh_token) VALUES (UUID(), ?, ?)',
        [user.id, refreshToken]
      );
    } else {
      await pool.execute(
        'UPDATE tokens SET refresh_token = ? WHERE user_id = ?',
        [refreshToken, user.id]
      );
    }

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE),
    });

    return res.redirect(
      `${FRONTEND_URL}/oauth-success?accessToken=${accessToken}&userId=${user.id}&role=${user.role}`
    );

  } catch (err) {
    console.error(err);
    return res.redirect(`${FRONTEND_URL}/oauth-fail?reason=server_error`);
  }
};

module.exports = {
  facebookCallback,
};
