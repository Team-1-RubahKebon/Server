const app = require("../app");
const request = require("supertest");
const { Hash } = require("../helpers/Hash");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");

beforeAll(async () => {});

afterAll(async () => {});

describe("POST /teachers/register", () => {
  describe("SUCCESS CASE", () => {
    test("should create new teacher and return status 201", async () => {
      const body = {
        email: "teacher@mail.com",
        password: "123456",
        name: "teacher",
        Class: "6426f6c99381fcb4116592f9",
        address: "Namek",
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
    });
  });

  describe("FAIL CASE", () => {
    test("should fail to create teacher because email is registered and return status 400", async () => {
      const body = {
        email: "teacher@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });
    test("should fail to create teacher because email is null and return status 400", async () => {
      const body = {
        // email: 'eren@mail.com',
        password: "123456",
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create teacher because password is null and return status 400", async () => {
      const body = {
        email: "luke@mail.com",
        // password: '123456'
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create teacher because of wrong email format and return status 400", async () => {
      const body = {
        email: "brand@mail",
        password: "123456",
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "This should be an email"
      );
    });

    test("should fail to create teacher because email is empty and return status 400", async () => {
      const body = {
        email: "",
        password: "123456",
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email cannot be empty");
    });

    test("should fail to create teacher because password is empty and return status 400", async () => {
      const body = {
        email: "jack@mail.com",
        password: "",
      };

      const response = await request(app).post("/teachers/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Password cannot be empty"
      );
    });
  });
});
