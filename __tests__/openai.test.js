const request = require("supertest");
const app = require("../app");
const openai = require("../config/openAI");

//TODO fail case should be handled

describe("POST /teachers/ai", () => {
  describe("SUCCESS CASE", () => {
    test("should give question to ai and return status 200", async () => {
      const body = {
        chat: "what is a car?",
      };
      const response = await request(app).post("/teachers/ai").send(body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});
