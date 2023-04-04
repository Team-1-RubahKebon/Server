const app = require("../app");
const request = require("supertest");
const { Hash } = require("../helpers/Hash");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const User = require("../models/User");
const { ObjectId } = require("mongodb");
const { create } = require('../helpers/Token');
const multer = require('multer');
const StudentAnswer = require('../models/StudentAnswer');
const Token = require("../helpers/Token");

jest.mock("../config/clientVision.js", () => {
  return {
    annotateImage: () => {
      return [
        {
          fullTextAnnotation: {
            text: "LEMBAR JAWABAN\n(1). (A) B C D ##\n(2). A B (C) D ##\n(3). A B C (D) ##\n(4). A (B) C D ##\n(5). A B (C) D ##\n(6). A B (C) D ##\n(7). A (B) C D ##\n(8). A B C (D) ##\n(9). (A) B C D ##\n(10) A (B) C D ##\nESSAY\n(#1) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus.\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dianissim ante\n(#2) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante\n(#3) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dianissim ante\n(#4) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante\n(#5) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante",
          },
        },
      ];
    },
  };
});
// jest.mock("@google-cloud/vision", () => {
//   const vision = () => ({
//     ImageAnnotatorClient: jest.fn().mockImplementation(() => {
//       const client = {
//         annotateImage: () => {
//           return [{
//             fullTextAnnotation: {
//               text: "adsdasdad"
//             }
//           }]
//         }
//       }
//       return client
//     })
//   })
//   return vision
// })
jest.mock("multer", () => {
  const multer = () => ({
    single: () => {
      return (req, res, next) => {
        req.file = {
          uri: "http://test.png",
        };
        return next();
      };
    },
  });
  multer.storage = () => jest.fn();
  return multer;
});

let access_token = Token.create({ id: '642c74d1895e662920e1bacd' })

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
        email: "zoro@mail.com",
        password: "123456",
        name: "zoro",
        Class: new Object("642b4196153a77181758b232"),
        address: "shigansina",
        role: "Student"
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
        email: "eren@mail.com",
        password: "123456",
        name: "eren",
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
    test("should let student in and return status 200", async () => {
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
        email: "zeke@mail.com",
        password: "123456",
      };

      const response = await request(app).post("/students/login").send(body);

      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "You are not student");
    });

  })

})

describe("POST /students/upload/:courseId", () => {
  describe("SUCCESS CASE", () => {
    test("should post student answers and return status 200", async () => {
      const response = await request(app)
        .post("/students/upload/642c6fe9d93b17c1b8505f80")
        .set("access_token", access_token)
        .attach("image", "./__tests__/assets/Form_Lembar_Jawaban.jpg");

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("isWrong", expect.any(Boolean));
      expect(response.body[0]).toHaveProperty("rowNumber", expect.any(Number));
      expect(response.body[0]).toHaveProperty("answer", expect.any(String));
      expect(response.body[0]).toHaveProperty("answerType", expect.any(String));
    });
  });

  describe("FAIL CASE", () => {
    test("should fail to post student answer and return status 400", async () => {

      const courseId = '1'

      const response = await request(app)
        .post(`/students/upload/${courseId}`)
        .set("access_token", access_token)
        .attach("image", "./__tests__/assets/Form_Lembar_Jawaban.jpg");

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "wrong parameter");
    });
  });
});

describe("GET /students/assignments", () => {
  describe("SUCCESS CASE", () => {

    test('should get assignments and return status 200', async () => {

      const response = await request(app).get("/students/assignments")
        .set("access_token", access_token)

      console.log(response, "<<<<<<<<<<<<<<<<<<<<<<,,response")
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toHaveProperty("StudentAnswers", expect.any(Array))
      expect(response.body[0]).toHaveProperty("Students", expect.any(Array))
      expect(response.body[0]).toHaveProperty("_id", expect.any(String))
      expect(response.body[0]).toHaveProperty("name", expect.any(String))
      expect(response.body[0]).toHaveProperty("QuestionId", expect.any(String))
      expect(response.body[0]).toHaveProperty("ClassId", expect.any(Object))
      expect(response.body[0]).toHaveProperty("subject", expect.any(String))
      expect(response.body[0]).toHaveProperty("deadline", expect.any(String))
      expect(response.body[0]).toHaveProperty("assignmentDate", expect.any(String))
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number))

    });

    test('should get assignment by id and return status 200', async () => {

      const response = await request(app).get("/students/assignments/642c6fe9d93b17c1b8505f80")
        .set("access_token", access_token)
      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array))
      expect(response.body).toHaveProperty("Students", expect.any(Array))
      expect(response.body).toHaveProperty("_id", expect.any(String))
      expect(response.body).toHaveProperty("name", expect.any(String))
      expect(response.body).toHaveProperty("QuestionId", expect.any(Object))
      expect(response.body).toHaveProperty("ClassId", expect.any(Object))
      expect(response.body).toHaveProperty("subject", expect.any(String))
      expect(response.body).toHaveProperty("deadline", expect.any(String))
      expect(response.body).toHaveProperty("assignmentDate", expect.any(String))
      expect(response.body).toHaveProperty("__v", expect.any(Number))

    });
  })

  describe("FAILED CASE", () => {

    test("should be handle error of get all students assignments", async () => {

      jest.spyOn(Assignment, "find").mockRejectedValue("Error");

      return await request(app).get("/students/assignments")
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.message).toBe("Internal Server Error");
        })
        .catch((err) => {
          console.log(err);
        });
    });

    test("should be failed and return status 500", async () => {
      const response = await request(app).get("/students/assignments/1")
        .set("access_token", access_token)
      expect(response.status).toBe(500);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
  });
})

describe("GET /students", () => {
  describe("SUCCESS CASE", () => {

    test('should get students and return status 200', async () => {

      const response = await request(app).get("/students")
        .set("access_token", access_token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Array)
      expect(response.body[0]).toHaveProperty("_id", expect.any(String))
      expect(response.body[0]).toHaveProperty("name", expect.any(String))
      expect(response.body[0]).toHaveProperty("email", expect.any(String))
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number))
      expect(response.body[0]).toHaveProperty("role", expect.any(String))
      expect(response.body[0]).toHaveProperty("Class", expect.any(String))

    });

    test("should get student by id and return status 200", async () => {
      const response = await request(app)
        .get("/students/profile")
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
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test("should be handle error of get students", async () => {

      jest.spyOn(User, "find").mockRejectedValue("Error");

      return await request(app)
        .get("/students")
        .set("access_token", access_token)
        .then((res) => {
          expect(res.status).toBe(500);
          expect(res.body.message).toBe("Internal Server Error");
        })
        .catch((err) => {
          console.log(err);
        });
    });


    test("should be failed and return status 500", async () => {
      jest.spyOn(User, "findOne").mockRejectedValue("Error");

      return await request(app).get("/students/profile")
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
})


describe("GET /students/class", () => {
  describe("SUCCESS CASE", () => {
    test("should get class and return status 200", async () => {
      const response = await request(app).get("/students/class");

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
  describe("FAILED CASE", () => {
    test("should be handle error of get all classes", async () => {
      jest.spyOn(Class, "find").mockRejectedValue("Error");

      return await request(app)
        .get("/students/class")
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


describe("GET /students/answers", () => {
  describe("SUCCESS CASE", () => {

    test("should get students answers and return status 200", async () => {

      const response = await request(app)
        .get("/students/answers")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("Assignment", expect.any(Object));
      expect(response.body[0]).toHaveProperty("Student", expect.any(String));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("Answers", expect.any(Array));
      expect(response.body[0]).toHaveProperty("score", expect.any(Number));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });
  })

  describe("FAILED CASE", () => {
    test("should be handle error of get all student answers", async () => {

      jest.spyOn(StudentAnswer, "find").mockRejectedValue("Error");

      return await request(app).get("/students/answers")
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
})

describe("GET /students/answers/:id", () => {
  describe("SUCCESS CASE", () => {

    test('should get student answers by id and return status 200', async () => {

      const response = await request(app).get("/students/answers/642c6fe9d93b17c1b8505f86")
        .set("access_token", access_token)

      expect(response.status).toBe(200)
      expect(response.body).toBeInstanceOf(Object)
      expect(response.body).toHaveProperty("_id", expect.any(String))
      expect(response.body).toHaveProperty("Assignment", expect.any(Object))
      expect(response.body).toHaveProperty("Student", expect.any(Object))
      expect(response.body).toHaveProperty("status", expect.any(String))
      expect(response.body).toHaveProperty("imgUrl", expect.any(String))
      expect(response.body).toHaveProperty("Answers", expect.any(Array))
      expect(response.body).toHaveProperty("score", expect.any(Number))
      expect(response.body).toHaveProperty("__v", expect.any(Number))

    });
  })
  describe("FAILED CASE", () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })
    test("should be handle error of get student answer by id", async () => {

      jest.spyOn(StudentAnswer, "find").mockRejectedValue("Error");

      return await request(app).get("/students/answers/642aeb1a982c231706fa3202")
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
})

describe("GET /students/answers/assigned", () => {
  describe("SUCCESS CASE", () => {

    test("should get students assignment with status assigned and return status 200", async () => {

      const response = await request(app)
        .get("/students/answers/assigned")
        .set("access_token", access_token);

      console.log(response, "<<<<<<<<<<<<<<<,,ini response terbaru")
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      // expect(response.body[0]).toHaveProperty("Assignment", expect.any(Object));
      expect(response.body[0]).toHaveProperty("Student", expect.any(String));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("Answers", expect.any(Array));
      expect(response.body[0]).toHaveProperty("score", expect.any(Number));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });
  })

  describe("FAILED CASE", () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test("should be handle error of get all student answers", async () => {

      jest.spyOn(StudentAnswer, "find").mockRejectedValue("Error");

      return await request(app).get("/students/answers/assigned")
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
})

describe("GET /students/answers/returned", () => {
  describe("SUCCESS CASE", () => {

    test("should get students assignment with status assigned and return status 200", async () => {

      const response = await request(app)
        .get("/students/answers/returned")
        .set("access_token", access_token);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("Assignment", expect.any(Object));
      expect(response.body[0]).toHaveProperty("Student", expect.any(String));
      expect(response.body[0]).toHaveProperty("status", expect.any(String));
      expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
      expect(response.body[0]).toHaveProperty("Answers", expect.any(Array));
      expect(response.body[0]).toHaveProperty("score", expect.any(Number));
      expect(response.body[0]).toHaveProperty("__v", expect.any(Number));
    });
  })

  describe("FAILED CASE", () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test("should be handle error of get all student answers returned", async () => {

      jest.spyOn(StudentAnswer, "find").mockRejectedValue("Error");

      return await request(app).get("/students/answers/returned")
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
})

describe("GET /students/average", () => {
  describe("SUCCESS CASE", () => {

    test("should get students assignment average score 200", async () => {

      const response = await request(app)
        .get("/students/average")
        .set("access_token", access_token);

      
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty("_id", expect.any(String));
      expect(response.body[0]).toHaveProperty("avgScore", expect.any(Number));
    });
  })

  describe("FAILED CASE", () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    test("should be handle error of get student average score", async () => {

      jest.spyOn(StudentAnswer, "aggregate").mockRejectedValue("Error");

      return await request(app).get("/students/average")
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
})

