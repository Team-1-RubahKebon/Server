const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

jest.mock("../config/googleAuth.js", () => {
  return {
    verifyIdToken: () => {
      return {
        getPayload: () => {
          return {
            name: 'bebas',
            email: 'bebas@mail.com'
          }
        },
      }
    }
  };
});

describe("POST /students/googlein", () => {
  // afterAll(async () => {
  //   try {
  //     await User.deleteMany();
  //   } catch (error) {
  //     console.log(error)
  //   }
  // })
  describe("SUCCESS CASE", () => {
    test("should login to google and return status 200", async () => {
      const headers = {
        token_google: "credential", //? ini harusnya credential khusus dari google
      };
      const response = await request(app)
        .post("/students/googlein")
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });
});

describe("POST /teachers/googlein", () => {
  // afterAll(async () => {
  //   try {
  //     await User.deleteMany();
  //   } catch (error) {
  //     console.log(error)
  //   }
  // })
  describe("SUCCESS CASE", () => {
    test("should login to google and return status 200", async () => {
      const headers = {
        token_google: "credential", //? ini harusnya credential khusus dari google
      };
      const response = await request(app)
        .post("/teachers/googlein")
        .set(headers);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });
});
