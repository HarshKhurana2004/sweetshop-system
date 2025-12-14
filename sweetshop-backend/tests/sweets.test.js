const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');
const jwt = require('jsonwebtoken');

let adminToken = "";

beforeAll((done) => {
  db.serialize(() => {

    // Reset tables
    db.run("DELETE FROM sweets");
    db.run("DELETE FROM users");

    // Reset AUTOINCREMENT counters
    db.run("DELETE FROM sqlite_sequence", () => {

      const hashedPassword = "$2b$10$1GDUZIr3TjHJM1T9K7W3EOmWZc5W.8IKuJf4uS7ePtaFvQKg9vQS";

      // Insert admin user - this will now get id=1
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ["Admin", "admin@example.com", hashedPassword, "admin"],
        function () {

          adminToken = jwt.sign(
            { id: this.lastID, role: "admin" },
            "MY_SECRET_KEY"
          );

          console.log("Admin inserted with ID:", this.lastID);

          // Insert sweet - this will now get id=1 as well
          db.run(
            `INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)`,
            ["Initial Sweet", "Candy", 10, 5],
            function () {
              console.log("Sweet inserted with ID:", this.lastID);
              done();
            }
          );

        }
      );

    });

  });
});



// ---------------- ADD SWEET ----------------
describe('Sweets: Add Sweet', () => {
  it('should allow admin to add a new sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 50,
        quantity: 20
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Sweet added successfully');
  });
});


// ---------------- GET ALL SWEETS ----------------
describe('Sweets: Get All Sweets', () => {
  it('should return all sweets', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


// ---------------- SEARCH SWEETS ----------------
describe('Sweets: Search Sweets', () => {
  it('should search sweets by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?name=Sweet')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});


// ---------------- UPDATE SWEET ----------------
describe('Sweets: Update Sweet', () => {
  it('should update sweet details (admin only)', async () => {
    const res = await request(app)
      .put('/api/sweets/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: "Updated Chocolate",
        category: "Updated Category",
        price: 60,
        quantity: 50
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sweet updated successfully');
  });
});
// ---------------- RESTOCK SWEET ----------------
describe('Sweets: Restock Sweet', () => {

  it('should increase sweet quantity (admin only)', async () => {

    const res = await request(app)
      .post('/api/sweets/1/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sweet restocked successfully');
  });

});

// ---------------- PURCHASE SWEET ----------------
describe('Sweets: Purchase Sweet', () => {

  it('should decrease sweet quantity by 1', async () => {
    const res = await request(app)
      .post('/api/sweets/1/purchase')
      .set('Authorization', `Bearer ${adminToken}`);  // normal users also allowed

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sweet purchased successfully');
  });

});
// ---------------- DELETE SWEET ----------------
describe('Sweets: Delete Sweet', () => {
  it('should delete a sweet (admin only)', async () => {
    const res = await request(app)
      .delete('/api/sweets/1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Sweet deleted successfully');
  });
});
