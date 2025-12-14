const db = require("./db/database");
const bcrypt = require("bcrypt");

(async () => {
  const hashed = await bcrypt.hash("admin123", 10);

  db.run(
    `INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`,
    ["Admin", "admin@example.com", hashed, "admin"],
    () => {
      console.log("Admin created.");
      process.exit();
    }
  );
})();
