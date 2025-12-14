const db = require('../db/database');

exports.add = (name, category, price, quantity) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)`,
      [name, category, price, quantity],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM sweets`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
exports.search = (name, category, minPrice, maxPrice) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM sweets WHERE 1=1`;
    let params = [];

    if (name) {
      query += ` AND name LIKE ?`;
      params.push(`%${name}%`);
    }

    if (category) {
      query += ` AND category LIKE ?`;
      params.push(`%${category}%`);
    }

    if (minPrice) {
      query += ` AND price >= ?`;
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND price <= ?`;
      params.push(maxPrice);
    }

    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
exports.update = (id, name, category, price, quantity) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE sweets SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?`,
      [name, category, price, quantity, id],
      function (err) {
        if (err) return reject(err);

        if (this.changes === 0) {
          return reject(new Error("Sweet not found"));
        }

        resolve();
      }
    );
  });
};
exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM sweets WHERE id = ?`,
      [id],
      function (err) {
        if (err) return reject(err);

        if (this.changes === 0) {
          return reject(new Error("Sweet not found"));
        }

        resolve();
      }
    );
  });
};
exports.purchase = (id) => {
  return new Promise((resolve, reject) => {
    // Check current quantity
    db.get(`SELECT quantity FROM sweets WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error("Sweet not found"));

      if (row.quantity <= 0) {
        return reject(new Error("Out of stock"));
      }

      // Reduce quantity
      const newQty = row.quantity - 1;

      db.run(
        `UPDATE sweets SET quantity = ? WHERE id = ?`,
        [newQty, id],
        function (err2) {
          if (err2) return reject(err2);
          resolve();
        }
      );
    });
  });
};
exports.restock = (id, amount) => {
  return new Promise((resolve, reject) => {

    // Get current quantity
    db.get(`SELECT quantity FROM sweets WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error("Sweet not found"));

      const newQty = row.quantity + amount;

      db.run(
        `UPDATE sweets SET quantity = ? WHERE id = ?`,
        [newQty, id],
        function (err2) {
          if (err2) return reject(err2);
          resolve();
        }
      );
    });

  });
};
