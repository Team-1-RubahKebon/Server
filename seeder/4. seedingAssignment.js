const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
require("../connection");
let assignments = require("../mock_data/assignment.json");
const Question = require("../models/Question");

async function seeding() {
  let classes = await Class.find();
  let adaptedClass = classes.map((el) => el.id);

  questionForm = {
    questions: [],
  };
  for (let i = 0; i < 15; i++) {
    let question = {
      rowNumber: ++i,
      question: "test 1",
      selection: {
        A: "Test",
        B: "Test",
        C: "Test",
        D: "Test",
      },
      answerType: i < 10 ? "pg" : "essay",
      keyword: "test",
    };
    questionForm.questions.push(question);
  }

  assignments.forEach(async (el) => {
    let idx = Math.floor(Math.random() * classes.length);
    let randomClass = adaptedClass[idx];
    el.ClassId = randomClass;

    let classId = await Class.findById(el.ClassId);

    // let adaptedStudents = classId.Students.map((el) => el._id);

    console.log(classId.Students);

    let questionCreate = new Question(questionForm);
    let createdQues = await questionCreate.save();

    let assignmentCreate = new Assignment({
      ...el,
      QuestionId: createdQues._id,
      Students: classId.Students,
    });
    let saveAssign = await assignmentCreate.save();

    console.log(saveAssign);
  });
}

seeding();
