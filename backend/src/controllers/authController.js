const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(name,email,password) Values($1,$2,$3)`,
      [name, email, hashedPassword],
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server failed to register new user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExits = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = userExits.rows[0];
    if (!user) {
      return res
        .status(400)
        .json({ message: "Your email or password is incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Your email or password is incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" },
    );
    res.status(200).json({ message: "Welcome back", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
