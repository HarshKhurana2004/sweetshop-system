const db = require('./src/db/database');

db.all("SELECT * FROM users", [], (err, rows) => {
  if (err) {
    console.error("DB ERROR:", err);
  } else {
    console.log("USERS TABLE:");
    console.table(rows);
  }
  process.exit();
});
