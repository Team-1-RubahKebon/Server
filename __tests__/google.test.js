const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

describe.skip("POST /teachers/googlein", () => {
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
