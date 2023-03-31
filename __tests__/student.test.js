const app = require('../app')
const request = require("supertest")
const { Hash } = require('../helpers/Hash');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');

let assignments
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

})

afterAll(async () => {
    await Assignment.deleteMany({ assignments });
})


describe("GET /students/assignments", () => {
    describe("SUCCESS CASE", () => {

        test('should get assignments and return status 200', async () => {

            const response = await request(app).get("/students/assignments")
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
            expect(response.body[0]).toHaveProperty("StudentAnswers", expect.any(Array))
            expect(response.body[0]).toHaveProperty("_id", expect.any(String))
            expect(response.body[0]).toHaveProperty("name", expect.any(String))
            expect(response.body[0]).toHaveProperty("QuestionId", expect.any(String))
            expect(response.body[0]).toHaveProperty("ClassId", expect.any(String))
            expect(response.body[0]).toHaveProperty("subject", expect.any(String))
            expect(response.body[0]).toHaveProperty("deadline", expect.any(String))
            expect(response.body[0]).toHaveProperty("assignmentDate", expect.any(String))
            expect(response.body[0]).toHaveProperty("__v", expect.any(Number))

        });

        test('should get students and return status 200', async () => {

            const response = await request(app).get("/students")
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
            expect(response.body[0]).toHaveProperty("_id", expect.any(String))
            expect(response.body[0]).toHaveProperty("name", expect.any(String))
            expect(response.body[0]).toHaveProperty("email", expect.any(String))
            expect(response.body[0]).toHaveProperty("address", expect.any(String))
            expect(response.body[0]).toHaveProperty("__v", expect.any(Number))
            expect(response.body[0]).toHaveProperty("role", expect.any(String))
            expect(response.body[0]).toHaveProperty("Class", expect.any(String))

        });



        test('should get assignments by id and return status 200', async () => {


            const response = await request(app).get("/students/assignments/64269093860b241f551672f4")

            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty("StudentAnswers", expect.any(Array))
            expect(response.body).toHaveProperty("_id", expect.any(String))
            expect(response.body).toHaveProperty("name", expect.any(String))
            expect(response.body).toHaveProperty("QuestionId", expect.any(String))
            expect(response.body).toHaveProperty("ClassId", expect.any(String))
            expect(response.body).toHaveProperty("subject", expect.any(String))
            expect(response.body).toHaveProperty("deadline", expect.any(String))
            expect(response.body).toHaveProperty("assignmentDate", expect.any(String))
            expect(response.body).toHaveProperty("__v", expect.any(Number))

        });


        test('should get student by id and return status 200', async () => {

            const response = await request(app).get("/students/64259587118dc84bb0073ea2")
            console.log(response.body, "<<<<<<<<<<<<<<<<<<<<<<<<<<<< ini ")
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty("_id", expect.any(String))
            expect(response.body).toHaveProperty("name", expect.any(String))
            expect(response.body).toHaveProperty("email", expect.any(String))
            expect(response.body).toHaveProperty("address", expect.any(String))
            expect(response.body).toHaveProperty("__v", expect.any(Number))
            expect(response.body).toHaveProperty("role", expect.any(String))
            expect(response.body).toHaveProperty("Class", expect.any(String))

        });
    })

    // describe("FAIL CASE", () => {

    //     test.skip('should fail to create movies because of data not found return status 404', async () => {


    //         const response = await (await request(app).get("/customers/movies/33"))
    //         console.log(response.body, '<<<<<<<<<<<<<<<<<< ini res.body')
    //         expect(response.status).toBe(404)
    //         expect(response.body).toBeInstanceOf(Object)
    //         expect(response.body).toHaveProperty("message", `Data not found!`)

    //     });
    // })
})
