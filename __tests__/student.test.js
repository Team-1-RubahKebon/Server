const app = require("../app");
const request = require("supertest");
const { Hash } = require("../helpers/Hash");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");

let assignments;
beforeAll(async () => {
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
  await Assignment.deleteMany({ assignments });
});

describe.skip("POST /students/register", () => {
  describe("SUCCESS CASE", () => {
    test("should create new student and return status 201", async () => {
      const body = {
        email: "eren@mail.com",
        password: "123456",
        name: "eren",
        Class: "6426f6c99381fcb4116592f9",
        address: "Namek",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
    });
  });

  describe.skip("FAIL CASE", () => {
    test.only("should fail to create customer because email is registered and return status 400", async () => {
      const body = {
        email: "eren@mail.com",
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
    test("should fail to create customer because email is null and return status 400", async () => {
      const body = {
        // email: 'eren@mail.com',
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

    test("should fail to create customer because password is null and return status 400", async () => {
      const body = {
        email: "luke@mail.com",
        // password: '123456'
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "required fields must be filled"
      );
    });

    test("should fail to create customer because of wrong email format and return status 400", async () => {
      const body = {
        email: "brand@mail",
        password: "123456",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "This should be an email"
      );
    });

    test("should fail to create customer because email is empty and return status 400", async () => {
      const body = {
        email: "",
        password: "123456",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email cannot be empty");
    });

    test("should fail to create customer because password is empty and return status 400", async () => {
      const body = {
        email: "jack@mail.com",
        password: "",
      };

      const response = await request(app).post("/students/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Password cannot be empty"
      );
    });
  });
});

describe.skip("GET /students/assignments", () => {
  describe("SUCCESS CASE", () => {
    test("should get assignments and return status 200", async () => {
      const response = await request(app).get("/students/assignments");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty(
        "StudentAnswers",
        expect.any(Array)
      );
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("QuestionId", expect.any(String));
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(String));
      expect(response.body[0]).toHaveProperty("subject", expect.any(String));
      expect(response.body[0]).toHaveProperty("deadline", expect.any(String));
      expect(response.body[0]).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });

    test("should get students and return status 200", async () => {
      const response = await request(app).get("/students");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("email", expect.any(String));
      expect(response.body[0]).toHaveProperty("address", expect.any(String));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
      expect(response.body[0]).toHaveProperty("role", expect.any(String));
      expect(response.body[0]).toHaveProperty("Class", expect.any(String));
    });

    test("should get assignments by id and return status 200", async () => {
      const response = await request(app).get(
        "/students/assignments/642707212f3ca070247c2fab"
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array));
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("QuestionId", expect.any(String));
      expect(response.body).toHaveProperty("ClassId", expect.any(String));
      expect(response.body).toHaveProperty("subject", expect.any(String));
      expect(response.body).toHaveProperty("deadline", expect.any(String));
      expect(response.body).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("__v", expect.any(Number));
    });

    test("should get student by id and return status 200", async () => {
      const response = await request(app).get(
        "/students/64259587118dc84bb0073ea2"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("email", expect.any(String));
      expect(response.body).toHaveProperty("address", expect.any(String));
      expect(response.body).toHaveProperty("__v", expect.any(Number));
      expect(response.body).toHaveProperty("role", expect.any(String));
      expect(response.body).toHaveProperty("Class", expect.any(String));
    });
  });

  // describe("FAIL CASE", () => {

  //     test.skip('should fail to create movies because of data not found return status 404', async () => {

  //         const response = await (await request(app).get("/students/movies/33"))
  //         console.log(response.body, '<<<<<<<<<<<<<<<<<< ini res.body')
  //         expect(response.status).toBe(404)
  //         expect(response.body).toBeInstanceOf(Object)
  //         expect(response.body).toHaveProperty("message", `Data not found!`)

  //     });
  // })
});
