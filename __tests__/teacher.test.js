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
        email: "teachertest@mail.com",
        password: "123456",
        name: "teachertest",
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
        email: "teachertest@mail.com",
        password: "123456",
        name: "teachertest",
        address: "Namek",
      };

      const response = await request(app).post("/teachers/regZister").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email has registered already"
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

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });

    test("should fail to create teacher because email is empty and return status 400", async () => {
      const body = {
        email: "",
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
        "required fields must be filled"
      );
    });
  });
});

describe("POST /teachers/login", () => {
  describe("SUCCESS CASE", () => {
    test("should login teacher and return status 201", async () => {
      const body = {
        email: "teachertest@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
    });
  });

  describe("FAIL CASE", () => {
    test("should fail to login teacher because email is null and return status 400", async () => {
      const body = {
        // email: "teachertest@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email/Password must be filled"
      );
    });

    test("should fail to login teacher because password is null and return status 400", async () => {
      const body = {
        email: "teachertest@mail.com",
        // password: "123456",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email/Password must be filled"
      );
    });

    test("should fail to login teacher because email is empty and return status 400", async () => {
      const body = {
        email: "",
        password: "123456",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email/Password must be filled"
      );
    });

    test("should fail to login teacher because password is empty and return status 400", async () => {
      const body = {
        email: "teachertest@mail.com",
        password: "",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email/Password must be filled"
      );
    });

    test("should fail to login teacher because email is wrong and return status 401", async () => {
      const body = {
        email: "huhu@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Wrong Email/Password");
    });

    test("should fail to login teacher because password is wrong and return status 401", async () => {
      const body = {
        email: "teachertest@mail.com",
        password: "654321",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Wrong Email/Password");
    });

    test("should fail to login because the role is not teacher and return status 403", async () => {
      const body = {
        email: "hvolet0@netvibes.com",
        password: "fVxDRdzPxhgb",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "You are not teacher");
    });
  });
});

describe("GET /teachers/class", () => {
  describe("SUCCESS CASE", () => {
    test("should get get all classes and return status 200", async () => {
      const response = await request(app).get("/teachers/class");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("schedule", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Assignments", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Students", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Teacher", expect.any(Object));
    });
    test("should get get single class and return status 200", async () => {
      const response = await request(app).get(
        "/teachers/class/6427ba76af2401519a682198"
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("schedule", expect.any(Array));
      expect(response.body).toHaveProperty("Assignments", expect.any(Array));
      expect(response.body).toHaveProperty("Students", expect.any(Array));
      expect(response.body).toHaveProperty("Teacher", expect.any(Object));
    });
  });
  describe("FAILED CASE", () => {
    it("should be failed and return status 500", async () => {
      const response = await request(app).get("/teachers/class/1");

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});

describe("GET /teachers/assignments", () => {
  describe("SUCCESS CASE", () => {
    test("should get get all assignments and return status 200", async () => {
      const response = await request(app).get("/teachers/assignments");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(String));
      expect(response.body[0]).toHaveProperty("subject", expect.any(String));
      expect(response.body[0]).toHaveProperty("deadline", expect.any(String));
      expect(response.body[0]).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body[0]).toHaveProperty(
        "StudentAnswers",
        expect.any(Array)
      );
    });
    test("should get get single assignment and return status 200", async () => {
      const response = await request(app).get(
        "/teachers/assignments/642868c18c2b623a1796ed16"
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("ClassId", expect.any(Object));
      expect(response.body).toHaveProperty("subject", expect.any(String));
      expect(response.body).toHaveProperty("deadline", expect.any(String));
      expect(response.body).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array));
    });
  });
  describe("FAILED CASE", () => {
    it("should be failed and return status 500", async () => {
      const response = await request(app).get("/teachers/assignments/1");

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});

describe("POST /teachers/class", () => {
  //! ini harus dihandle besok
  describe("SUCCESS CASE", () => {
    test("should get get all classes and return status 200", async () => {
      const body = {
        name: "xii-21",
        schedule: [
          {
            day: "monday",
            subjects: "Math",
          },
        ],
        Students: [
          {
            _id: "6427276088a14b06ae616964",
          },
        ],
        Teacher: {
          _id: "6427276088a14b06ae616982",
        },
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
    });
  });
});
