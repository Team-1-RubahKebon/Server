const taskRouter = require("express").Router();

taskRouter.get("/:taskId/pg"); //pg
taskRouter.get("/:taskId/essay/:row"); //essay

const soal = [
  {
    row: 1,
    question: "haus?",
    answer: "minum",
    type: "essay",
  },
  {
    row: 2,
    question: "haus?",
    answer: "minum",
    type: "essay",
  },
  {
    row: 3,
    question: `minum yang mana?`,
    answer: "B",
    option: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    type: "pg",
  },
];
