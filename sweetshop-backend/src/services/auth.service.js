const db = require('../db/database');
const bcrypt = require('bcrypt');

exports.register = (name, email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hashedPassword, "user"],
        function (err) {
          if (err) {
            return reject(new Error("Email already exists"));
          }
          resolve();
        }
      );

    } catch (e) {
      reject(e);
    }
  });
};
const jwt = require('jsonwebtoken');
const SECRET = "MY_SECRET_KEY"; // later we will move to .env

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
      if (err || !user) {
        return reject(new Error("Invalid credentials"));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return reject(new Error("Invalid credentials"));
      }

      // create JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        SECRET,
        { expiresIn: "1h" }
      );

      resolve(token);
    });
  });
};
