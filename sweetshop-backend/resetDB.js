const db = require("./src/db/database");

db.run("DELETE FROM users", () => {
  console.log("Users table cleared.");
  process.exit();
});
