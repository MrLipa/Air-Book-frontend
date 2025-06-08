const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const { registerSchema } = require('../validations/userValidation');

const registerNewUser = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, email, password, role } = value;

    const existingUser = await pool.query('SELECT 1 FROM air_book.users WHERE email = $1', [email]);

    if (existingUser.rowCount > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO air_book.users (first_name, last_name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [firstName, lastName, email, hashedPassword, role]
    );

    res.status(201).json({ message: `✅ User '${email}' successfully registered.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerNewUser,
};
