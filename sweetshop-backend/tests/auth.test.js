const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/database');

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM sweets");
    db.run("DELETE FROM users");
    db.run("DELETE FROM sqlite_sequence");
    done();
  });
});

describe('Auth: Register', () => {
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });
});

describe('Auth: Login', () => {
  it('should log in a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
