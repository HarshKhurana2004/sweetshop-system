const db = require("./src/db/database");
const bcrypt = require("bcrypt");

const insertAdmin = async () => {
  const hashed = await bcrypt.hash("admin123", 10);

  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ["Admin", "admin@example.com", hashed, "admin"],
    function (err) {
      if (err) {
        console.log("Error inserting admin:", err.message);
      } else {
        console.log("Admin inserted with ID:", this.lastID);
      }
      process.exit();
    }
  );
};

insertAdmin();
