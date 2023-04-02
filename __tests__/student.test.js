const app = require("../app");
const request = require("supertest");
const { Hash } = require("../helpers/Hash");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const { create } = require("../helpers/Token");

let access_token = create({ id: new ObjectId("6428985eda54ba5b3f904567") });
console.log(access_token, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<,access token ");
// let assignments
// beforeAll(async () => {
//     access_token = create({ _id: "64279daff8fac2152acafb09" })

//     const users = require("../mock_data/users.json");
//     let hashedUsers = users.map((el) => {
//         el.password = Hash.create(el.password);
//         el.test = 'testing'
//         return el;
//     });
//     console.log(hashedUsers ," BEFORE <<<<<<<<<<<<<<<<<<<<<<<<<<")
//     await User.insertMany(hashedUsers);

//     assignments = require("../mock_data/assignment.json");
//     let classes = await (await Class.find()).map((el) => el.id);
//     assignments = assignments.map((el) => {
//         let idx = Math.floor(Math.random() * classes.length);
//         let randomClass = classes[idx];
//         el.ClassId = randomClass;
//         el.test = 'testing'
//         return el;
//     });
//     console.log(assignments ," BEFORE <<<<<<<<<<<<<<<<<<<<<<<<<<")
//     await Assignment.insertMany(assignments);

// })

// afterAll(async () => {
//     let user = await User.deleteMany({ test: 'testing' });
//     let assignment =await Assignment.deleteMany({ test: 'testing' });
//     console.log(user,' user<<<<<<<<<<<<')
//     console.log(assignment,'assignmen <<<<<<<<<<<<<<<<<<<<,')
// })

describe("POST /students/register", () => {
  describe("SUCCESS CASE", () => {
    test.skip("should create new student and return status 201", async () => {
      const body = {
        email: "poror@mail.com",
        password: "123456",
        name: "poror",
        Class: new Object("6426f6c99381fcb4116592f9"),
        address: "shigansina",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
    });
  });

  describe("FAIL CASE", () => {
    test("should fail to create student because email is registered and return status 400", async () => {
      const body = {
        email: "bimbing@mail.com",
        password: "123456",
        name: "bimbing",
        Class: new Object("6426f6c99381fcb4116592f9"),
        address: "shigansina",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email has registered already"
      );
    });
    test("should fail to create student because email is null and return status 400", async () => {
      const body = {
        // email: 'eren@mail.com',
        name: "bimbing",
        password: "123456",
        Class: new Object("6426f6c99381fcb4116592f9"),
        address: "shigansina",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create student because password is null and return status 400", async () => {
      const body = {
        email: "eren@mail.com",
        name: "bimbing",
        // password: '123456',
        Class: new Object("6426f6c99381fcb4116592f9"),
        address: "shigansina",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create student because name is null and return status 400", async () => {
      const body = {
        email: "eren@mail.com",
        // name: 'bimbing',
        password: "123456",
        Class: new Object("6426f6c99381fcb4116592f9"),
        address: "shigansina",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create student because email is empty and return status 400", async () => {
      const body = {
        email: "",
        password: "123456",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create student because password is empty and return status 400", async () => {
      const body = {
        email: "jack@mail.com",
        password: "",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });
  });
});

describe("POST /student/login", () => {
  describe("SUCCESS CASE", () => {
    test("should create student and return status 200", async () => {
      const body = {
        email: "eren@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
    });
  });

  describe("FAIL CASE", () => {
    test("should fail to create student because of invalid email and return status 401", async () => {
      const body = {
        email: "hura@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Wrong Email/Password");
    });
    test("should fail to create student because of invalid password and return status 401", async () => {
      const body = {
        email: "eren@mail.com",
        password: "123",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Wrong Email/Password");
    });

    test("should fail to login student because password is null and return status 400", async () => {
      const body = {
        email: "eren@mail.com",
        // password: "123456",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email/Password must be filled"
      );
    });

    test("should fail to login student because email is empty and return status 400", async () => {
      const body = {
        email: "",
        password: "123456",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email/Password must be filled"
      );
    });

    test("should fail to login because the role is not student and return status 403", async () => {
      const body = {
        email: "hehe@hehe.com",
        password: "hehehe",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "You are not student");
    });
  });
});

describe("GET /students", () => {
  describe("SUCCESS CASE", () => {
    test("should get students and return status 200", async () => {
      const response = await request(app)
        .get("/students")
        .set("access_token", access_token);
      console.log(response, "<<<<<<<<<<<<<<<<<<<<< ini response ");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("email", expect.any(String));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
      expect(response.body[0]).toHaveProperty("role", expect.any(String));
      expect(response.body[0]).toHaveProperty("Class", expect.any(String));
    });

    test("should get student by id and return status 200", async () => {
      const response = await request(app)
        .get("/students/6428985eda54ba5b3f904567")
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("email", expect.any(String));
      expect(response.body).toHaveProperty("__v", expect.any(Number));
      expect(response.body).toHaveProperty("role", expect.any(String));
      expect(response.body).toHaveProperty("Class", expect.any(Object));
    });
  });

  describe("FAILED CASE", () => {
    it("should be failed and return status 500", async () => {
      const response = await request(app)
        .get("/students/assignments/1")
        .set("access_token", access_token);

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});

describe("GET /students/assignments", () => {
  describe("SUCCESS CASE", () => {
    test("should get assignments and return status 200", async () => {
      const response = await request(app)
        .get("/students/assignments")
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(
        "StudentAnswers",
        expect.any(Array)
      );
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      // expect(response.body[0]).toHaveProperty("QuestionId", expect.any(Object))
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(Object));
      expect(response.body[0]).toHaveProperty("subject", expect.any(String));
      expect(response.body[0]).toHaveProperty("deadline", expect.any(String));
      expect(response.body[0]).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });

    test("should get assignments by id and return status 200", async () => {
      const response = await request(app)
        .get("/students/assignments/642868c18c2b623a1796ed16")
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array));
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
      // expect(response.body).toHaveProperty("QuestionId", expect.any(Object))
      expect(response.body).toHaveProperty("ClassId", expect.any(Object));
      expect(response.body).toHaveProperty("subject", expect.any(String));
      expect(response.body).toHaveProperty("deadline", expect.any(String));
      expect(response.body).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("__v", expect.any(Number));
    });
  });

  describe("FAILED CASE", () => {
    it("should be failed and return status 500", async () => {
      const response = await request(app)
        .get("/students/assignments/1")
        .set("access_token", access_token);
      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});

describe("GET /students/class", () => {
  describe("SUCCESS CASE", () => {
    test("should get class and return status 200", async () => {
      const response = await request(app).get("/students/class");
      // .set("access_token", access_token)
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("schedule", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Assignments", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Students", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Teacher", expect.any(String));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });
  });
});

describe("GET /students/answers", () => {
  describe("SUCCESS CASE", () => {
    test("should get students answers and return status 200", async () => {
      const response = await request(app)
        .get("/students/answers")
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("Assignment", expect.any(String));
      expect(response.body[0]).toHaveProperty("Student", expect.any(String));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("Answers", expect.any(Array));
      expect(response.body[0]).toHaveProperty("turnedAt", expect.any(String));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });
  });
});
describe("GET /students/answers/:id", () => {
  describe("SUCCESS CASE", () => {
    test("should get student answers and return status 200", async () => {
      const response = await request(app)
        .get("/students/answers/6428985eda54ba5b3f904567")
        .set("access_token", access_token);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("Assignment", expect.any(Object));
      expect(response.body).toHaveProperty("Student", expect.any(Object));
      expect(response.body).toHaveProperty("status", expect.any(String));
      expect(response.body).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body).toHaveProperty("Answers", expect.any(Array));
      expect(response.body).toHaveProperty("turnedAt", expect.any(String));
      expect(response.body).toHaveProperty("__v", expect.any(Number));
    });
  });
});
