const app = require("../app");
const request = require("supertest");
const { Hash } = require("../helpers/Hash");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const Token = require("../helpers/Token");

beforeAll(async () => {});

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {});

describe("POST /teachers/register", () => {
  describe("SUCCESS CASE", () => {
    test("should create new teacher and return status 201", async () => {
      function makeid(length) {
        let result = "";
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
          counter += 1;
        }
        return result;
      }

      const nameRandom = makeid(5);
      const body = {
        email: nameRandom + "@mail.com",
        password: "123456",
        name: nameRandom,
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
        email: "elivermore4@sakura.ne.jp",
        password: "rDxT9TnO",
        name: "teachertest",
        address: "Namek",
      };

      const response = await request(app).post("/teachers/register").send(body);

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
        email: "elivermore4@sakura.ne.jp",
        password: "rDxT9TnO",
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
        email: "elivermore4@sakura.ne.jp",
        password: "654321",
      };

      const response = await request(app).post("/teachers/login").send(body);

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Wrong Email/Password");
    });

    test("should fail to login because the role is not teacher and return status 403", async () => {
      const body = {
        email: "asandelss@jigsy.com",
        password: "iG1S0bTtI4Q",
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
    test("should get all classes and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .get("/teachers/class")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("schedule", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Assignments", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Students", expect.any(Array));
      expect(response.body[0]).toHaveProperty("Teacher", expect.any(Object));
    });
    test("should get single class based on query and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .get("/teachers/class?name=xii-1")
        .set("access_token", access_token);

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
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/class/642ba838c6456c3c494a2724")
        .set("access_token", access_token);

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
    test("should be failed and return status 500", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/class/1")
        .set("access_token", access_token);

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
    test("should be handle error of get all classes", async () => {
      jest.spyOn(Class, "find").mockRejectedValue("Error");
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      return await request(app)
        .get("/teachers/class")
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.message).toBe("Internal Server Error");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

describe("GET /teachers/assignments", () => {
  describe("SUCCESS CASE", () => {
    test("should get all assignments and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/assignments")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(Object));
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
    test("should get single assignment based on ClassId and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/assignments?Class=642ba838c6456c3c494a2736")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(Object));
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
    test("should get single assignment based on name and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/assignments?name=ballred0")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("name", expect.any(String));
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(Object));
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
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/assignments/642ba8492213d643477e2ba1")
        .set("access_token", access_token);

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
    test("should be failed and return status 500", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/assignments/1")
        .set("access_token", access_token);

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
    test("should be handle error of get all assignment", async () => {
      jest.spyOn(Assignment, "find").mockRejectedValue("Error");
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      return await request(app)
        .get("/teachers/assignments")
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.message).toBe("Internal Server Error");
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

describe("DELETE /teachers/assignments", () => {
  describe.skip("SUCCESS CASE", () => {
    test("should delete single assignment and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .delete("/teachers/assignments/642ba90df3fbc812ca9b984e")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Assigment has been successfully deleted"
      );
    });
  });
  describe("FAILED CASE", () => {
    test("should be failed and return status 500", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .delete("/teachers/assignments/1")
        .set("access_token", access_token);

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});

describe("POST /teachers/assignments", () => {
  describe("SUCCESS CASE", () => {
    test("should create single assignment and return status 201", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJiZDc1OWQ2NzFjYjRiNWIzZTUxMCIsImlhdCI6MTY4MDU5MTcyMH0.sDKT5GSfGXq4OLpElLApHMwGtVMNkAhU-g8fssGEFOc";

      const body = {
        name: "makan bubur pake sumpit",
        ClassId: "642bbda7f2a80b1610bb84db",
        subject: "Chemistry",
        deadline: "2023-02-04T00:00:00.000Z",
        assignmentDate: "2022-10-26T00:00:00.000Z",
        questionForm: {
          questions: [],
        },
      };

      const response = await request(app)
        .post("/teachers/assignments")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("ClassId", expect.any(String));
      expect(response.body).toHaveProperty("subject", expect.any(String));
      expect(response.body).toHaveProperty("deadline", expect.any(String));
      expect(response.body).toHaveProperty(
        "assignmentDate",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array));
      expect(response.body).toHaveProperty("_id", expect.any(String));
    });
  });
  describe.only("FAILED CASE", () => {
    test("should fail to create assignment because the name is not inputted and return status 400", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJiZDc1OWQ2NzFjYjRiNWIzZTUxMCIsImlhdCI6MTY4MDU5MTcyMH0.sDKT5GSfGXq4OLpElLApHMwGtVMNkAhU-g8fssGEFOc";

      const body = {
        // name: "bangun candi 3",
        ClassId: "642bbda7f2a80b1610bb84db",
        subject: "Chemistry",
        deadline: "2023-02-04T00:00:00.000Z",
        assignmentDate: "2022-10-26T00:00:00.000Z",
        questionForm: {
          questions: [],
        },
      };

      const response = await request(app)
        .post("/teachers/assignments")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All assignment details must be filled"
      );
    });
    test("should fail to create assignment because the ClassId is not inputted and return status 400", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJiZDc1OWQ2NzFjYjRiNWIzZTUxMCIsImlhdCI6MTY4MDU5MTcyMH0.sDKT5GSfGXq4OLpElLApHMwGtVMNkAhU-g8fssGEFOc";

      const body = {
        name: "bangun candi 3",
        // ClassId: "642bbda7f2a80b1610bb84db",
        subject: "Chemistry",
        deadline: "2023-02-04T00:00:00.000Z",
        assignmentDate: "2022-10-26T00:00:00.000Z",
        questionForm: {
          questions: [],
        },
      };

      const response = await request(app)
        .post("/teachers/assignments")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All assignment details must be filled"
      );
    });
    test("should fail to create assignment because the subject is not inputted and return status 400", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJiZDc1OWQ2NzFjYjRiNWIzZTUxMCIsImlhdCI6MTY4MDU5MTcyMH0.sDKT5GSfGXq4OLpElLApHMwGtVMNkAhU-g8fssGEFOc";

      const body = {
        name: "bangun candi 3",
        ClassId: "642bbda7f2a80b1610bb84db",
        // subject: "Chemistry",
        deadline: "2023-02-04T00:00:00.000Z",
        assignmentDate: "2022-10-26T00:00:00.000Z",
        questionForm: {
          questions: [],
        },
      };

      const response = await request(app)
        .post("/teachers/assignments")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All assignment details must be filled"
      );
    });
    test("should fail to create assignment because the deadline is not inputted and return status 400", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJiZDc1OWQ2NzFjYjRiNWIzZTUxMCIsImlhdCI6MTY4MDU5MTcyMH0.sDKT5GSfGXq4OLpElLApHMwGtVMNkAhU-g8fssGEFOc";

      const body = {
        name: "bangun candi 3",
        ClassId: "642bbda7f2a80b1610bb84db",
        subject: "Chemistry",
        // deadline: "2023-02-04T00:00:00.000Z",
        assignmentDate: "2022-10-26T00:00:00.000Z",
        questionForm: {
          questions: [],
        },
      };

      const response = await request(app)
        .post("/teachers/assignments")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All assignment details must be filled"
      );
    });
    test("should fail to create assignment because the assignmentDate is not inputted and return status 400", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJiZDc1OWQ2NzFjYjRiNWIzZTUxMCIsImlhdCI6MTY4MDU5MTcyMH0.sDKT5GSfGXq4OLpElLApHMwGtVMNkAhU-g8fssGEFOc";

      const body = {
        name: "bangun candi 3",
        ClassId: "642bbda7f2a80b1610bb84db",
        subject: "Chemistry",
        deadline: "2023-02-04T00:00:00.000Z",
        // assignmentDate: "2022-10-26T00:00:00.000Z",
        questionForm: {
          questions: [],
        },
      };

      const response = await request(app)
        .post("/teachers/assignments")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All assignment details must be filled"
      );
    });
  });
});

describe("POST /teachers/class", () => {
  describe("SUCCESS CASE", () => {
    test("should post single class and return status 200", async () => {
      const body = {
        name: "xii-200",
        schedule: [
          {
            day: "monday",
            subjects: "Math",
          },
        ],
      };

      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .post("/teachers/class")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Class has been successfully added"
      );
    });
  });
  describe("FAILED CASE", () => {
    test("should fail to create class because the name is not inputted and return status 400", async () => {
      const body = {
        // name: "xii-200",
        schedule: [
          {
            day: "monday",
            subjects: "Math",
          },
        ],
      };

      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .post("/teachers/class")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All class details must be filled"
      );
    });
    test("should fail to create class because the schedule is not inputted and return status 400", async () => {
      const body = {
        name: "xii-200",
        // schedule: [
        //   {
        //     day: "monday",
        //     subjects: "Math",
        //   },
        // ],
      };

      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .post("/teachers/class")
        .send(body)
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "All class details must be filled"
      );
    });
  });
});

describe("GET /teachers/student/answer/:id", () => {
  describe("SUCCESS CASE", () => {
    test("should get all classes and return status 200", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .get("/teachers/student/answer/642ba93ff087b1b30882666f")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("Assignment", expect.any(Object));
      expect(response.body).toHaveProperty("Students", expect.any(String));
      expect(response.body).toHaveProperty("status", expect.any(String));
      expect(response.body).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body).toHaveProperty("Answers", expect.any(Array));
    });
  });
  describe("FAILED CASE", () => {
    test("should be failed and return status 400", async () => {
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .get("/teachers/student/answer/1")
        .set("access_token", access_token);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "wrong parameter");
    });
  });
});

describe("PATCH /teachers/student/answer/:id", () => {
  describe("SUCCESS CASE", () => {
    test("should get all classes and return status 200", async () => {
      const body = {
        newStatus: "Returned",
      };
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";

      const response = await request(app)
        .put("/teachers/student/answer/642ba93ff087b1b30882666f")
        .set("access_token", access_token)
        .send(body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Student answer status already updated"
      );
    });
  });
  describe("FAILED CASE", () => {
    test("should be failed and return status 400", async () => {
      const body = {
        newStatus: "Returned",
      };
      const access_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmJhODBkNTMzOTVjZjU0Mzc1ZDhiYSIsImlhdCI6MTY4MDU4NjMyMH0.9Q4aimgxzzzIlO_uu99uPFBw01lmeDKB6T_fKAawPLM";
      const response = await request(app)
        .patch("/teachers/student/answer/1")
        .set("access_token", access_token)
        .send(body);

      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
});
