const app = require("../app");
const request = require("supertest");
const { Hash } = require("../helpers/Hash");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const User = require("../models/User");

let assignments;
beforeAll(async () => {
  const users = require("../mock_data/users.json");
  let hashedUsers = users.map((el) => {
    el.password = Hash.create(el.password);
    return el;
  });
  await User.insertMany(hashedUsers);

  assignments = require("../mock_data/assignment.json");
  let classes = await (await Class.find()).map((el) => el.id);
  assignments = assignments.map((el) => {
    let idx = Math.floor(Math.random() * classes.length);
    let randomClass = classes[idx];
    el.ClassId = randomClass;

    return el;
  });
  await Assignment.insertMany(assignments);
});

afterAll(async () => {
  await User.deleteMany({ assignments });
  await Assignment.deleteMany({ assignments });
});

describe("POST /students/register", () => {
  describe("SUCCESS CASE", () => {
    test("should create new student and return status 201", async () => {
      const body = {
        email: "bimbing@mail.com",
        password: "123456",
        name: "bimbing",
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
  });
});

// describe("GET /students/assignments", () => {
//     describe("SUCCESS CASE", () => {

//         test('should get assignments and return status 200', async () => {

//             const response = await request(app).get("/students/assignments")
//             expect(response.status).toBe(200)
//             expect(response.body).toBeInstanceOf(Array)
//             expect(response.body[0]).toHaveProperty("StudentAnswers", expect.any(Array))
//             expect(response.body[0]).toHaveProperty("_id", expect.any(String))
//             expect(response.body[0]).toHaveProperty("name", expect.any(String))
//             // expect(response.body[0]).toHaveProperty("QuestionId", expect.any(String))
//             expect(response.body[0]).toHaveProperty("ClassId", expect.any(String))
//             expect(response.body[0]).toHaveProperty("subject", expect.any(String))
//             expect(response.body[0]).toHaveProperty("deadline", expect.any(String))
//             expect(response.body[0]).toHaveProperty("assignmentDate", expect.any(String))
//             expect(response.body[0]).toHaveProperty("__v", expect.any(Number))

//         });

//         test('should get students and return status 200', async () => {

//             const response = await request(app).get("/students")
//             expect(response.status).toBe(200)
//             expect(response.body).toBeInstanceOf(Array)
//             expect(response.body[0]).toHaveProperty("_id", expect.any(String))
//             expect(response.body[0]).toHaveProperty("name", expect.any(String))
//             expect(response.body[0]).toHaveProperty("email", expect.any(String))
//             expect(response.body[0]).toHaveProperty("address", expect.any(String))
//             expect(response.body[0]).toHaveProperty("__v", expect.any(Number))
//             expect(response.body[0]).toHaveProperty("role", expect.any(String))
//             expect(response.body[0]).toHaveProperty("Class", expect.any(String))

//         });

//         test('should get assignments by id and return status 200', async () => {

//             const response = await request(app).get("/students/assignments/6427aba6f0e4d5d1ee0d7c71")

//             expect(response.status).toBe(200)
//             expect(response.body).toBeInstanceOf(Object)
//             expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array))
//             expect(response.body).toHaveProperty("_id", expect.any(String))
//             expect(response.body).toHaveProperty("name", expect.any(String))
//             // expect(response.body).toHaveProperty("QuestionId", expect.any(String))
//             expect(response.body).toHaveProperty("ClassId", expect.any(Object))
//             expect(response.body).toHaveProperty("subject", expect.any(String))
//             expect(response.body).toHaveProperty("deadline", expect.any(String))
//             expect(response.body).toHaveProperty("assignmentDate", expect.any(String))
//             expect(response.body).toHaveProperty("__v", expect.any(Number))

//         });

      const response = await request(app).get("/students/answers")
        .set("access_token", access_token)
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toHaveProperty("_id", expect.any(String))
      expect(response.body[0]).toHaveProperty("Assignment", expect.any(String))
      expect(response.body[0]).toHaveProperty("Student", expect.any(String))
      expect(response.body[0]).toHaveProperty("status", expect.any(String))
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String))
      expect(response.body[0]).toHaveProperty("Answers", expect.any(Array))
      expect(response.body[0]).toHaveProperty("turnedAt", expect.any(String))
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number))

    });
  })
})

describe("GET /students/answers/:id", () => {
  describe("SUCCESS CASE", () => {

//         });
//     })

      const response = await request(app).get("/students/answers/6428985eda54ba5b3f904567")
        .set("access_token", access_token)
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("_id", expect.any(String))
      expect(response.body).toHaveProperty("Assignment", expect.any(Object))
      expect(response.body).toHaveProperty("Student", expect.any(Object))
      expect(response.body).toHaveProperty("status", expect.any(String))
      expect(response.body).toHaveProperty("imgUrl", expect.any(String))
      expect(response.body).toHaveProperty("Answers", expect.any(Array))
      expect(response.body).toHaveProperty("turnedAt", expect.any(String))
      expect(response.body).toHaveProperty("__v", expect.any(Number))

    });
  })

})

describe("POST /students/upload/:courseId", () => {
  describe("SUCCESS CASE", () => {

    test('should get student answers and return status 200', async () => {

      const body = {
        image: ''
      }

      const response = await request(app).post("/students/upload/64286992f8ed0c9380a9c8eb")
        .set("access_token", access_token)
        .send(body)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("_id", expect.any(String))
      expect(response.body).toHaveProperty("Assignment", expect.any(Object))
      expect(response.body).toHaveProperty("Student", expect.any(Object))
      expect(response.body).toHaveProperty("status", expect.any(String))
      expect(response.body).toHaveProperty("imgUrl", expect.any(String))
      expect(response.body).toHaveProperty("Answers", expect.any(Array))
      expect(response.body).toHaveProperty("turnedAt", expect.any(String))
      expect(response.body).toHaveProperty("__v", expect.any(Number))

    });
  })

  describe("FAIL CASE", () => {

    test('should fail to find assignment id and return status 404', async () => {

      const body = {
        image: 'Form-Lembar-jawaban.jpg'
      }

      const response = await request(app).post("/students/upload/1")
        .set("access_token", access_token)
        .send(body)

      expect(response.status).toBe(404)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("message", "wrong parameter")

    });
    test('should fail to post image due to empty body and return status 500', async () => {

      const body = {
        image: ''
      }

      const response = await request(app).post("/students/upload/64286992f8ed0c9380a9c8eb")
        .set("access_token", access_token)
        .send(body)

      expect(response.status).toBe(500)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("message", "Internal Server Error")

    });
  })
})

//             const response = await (await request(app).get("/students/assignment/asasdad"))
//             console.log(response.body, '<<<<<<<<<<<<<<<<<< ini res.body')
//             expect(response.status).toBe(404)
//             expect(response.body).toBeInstanceOf(Object)
//             expect(response.body).toHaveProperty("message", `Data not found!`)

//         });
//     })
// })
