const pool = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      `
            INSERT INTO users(name,email,password) 
            Values($1,$2,$3)`,
      [name, email, hashedPassword],
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Failed to register new user");
    res.status(500).json({
      message: "Server failed to register new user",
      err: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExits = await pool.query(
      `
        SELECT * FROM users WHERE email = $1`,
      [email],
    );
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
    res.status(200).json({ messages: "Welcome back", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", err: error.message });
  }
};

module.exports = { register, login };
