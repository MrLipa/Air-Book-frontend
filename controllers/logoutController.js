const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const logoutUser = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      return res.sendStatus(403);
    }

    try {
      const foundUser = await pool.query(
        `SELECT * FROM air_book.users 
         JOIN air_book.user_tokens USING (user_id) 
         WHERE refresh_token = $1 AND email = $2`,
        [refreshToken, decoded.userInfo.email]
      );

      if (foundUser.rows.length === 0) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        return res.status(200).json({ message: "User logout" });
      }

      await pool.query(
        "DELETE FROM air_book.user_tokens WHERE refresh_token = $1",
        [refreshToken]
      );

      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      return res.status(200).json({ message: "User logout" });

    } catch (dbErr) {
      console.error("Logout DB error:", dbErr.message);
      return res.sendStatus(500);
    }
  });
};

module.exports = {
  logoutUser,
};
