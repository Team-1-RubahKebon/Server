// const ocrAdapter
module.exports = (input) => {
  input = input.split("\nESSAY\n");
  let result = [];
  let multipleAnswersPool = input[0];
  let essayPool = input[1];

  multipleAnswersPool = multipleAnswersPool.split("\n");
  for (let i = 1; i < multipleAnswersPool.length; i++) {
    let pg = {};
    pg.rowNumber = i;
    pg.answer = answerLocator(multipleAnswersPool[i]);
    pg.answerType = "pg";
    pg.isWrong = false;
    result.push(pg);
  }

  function answerLocator(answerStr) {
    answerArr = answerStr.split(" ");
    var choice = "";
    for (let i = 1; i < answerArr.length; i++) {
      let selection = answerArr[i];
      if (selection.startsWith("(")) {
        choice = selection[1];
      }
    }
    return choice;
  }

  essayPool = essayPool.split("(#");
  for (let i = 1; i < essayPool.length; i++) {
    let element = essayPool[i];
    let essay = {};
    essay.rowNumber = "#" + element.slice(0, 1);
    essay.answer = element.slice(3);
    essay.answerType = "essay";
    essay.isWrong = false;
    result.push(essay);
  }
  return result;
};

let expected = [
  { rowNumber: 1, answer: "A", answerType: "pg", isWrong: false },
  { rowNumber: 2, answer: "C", answerType: "pg", isWrong: true },
  { rowNumber: 3, answer: "D", answerType: "pg", isWrong: false },
  { rowNumber: 4, answer: "B", answerType: "pg", isWrong: false },
  { rowNumber: 5, answer: "D", answerType: "pg", isWrong: false },
  { rowNumber: 6, answer: "D", answerType: "pg", isWrong: false },
  { rowNumber: 7, answer: "B", answerType: "pg", isWrong: true },
  { rowNumber: 8, answer: "D", answerType: "pg", isWrong: false },
  { rowNumber: 9, answer: "A", answerType: "pg", isWrong: false },
  { rowNumber: 10, answer: "C", answerType: "pg", isWrong: false },
  {
    rowNumber: "#1",
    answer:
      "Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus.\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dianissim ante",
    answerType: "essay",
    isWrong: false,
  },
  {
    rowNumber: "#2",
    answer:
      "Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante",
    answerType: "essay",
    isWrong: false,
  },
  {
    rowNumber: "#3",
    answer:
      "Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dianissim ante",
    answerType: "essay",
    isWrong: false,
  },
  {
    rowNumber: "#4",
    answer:
      "Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante",
    answerType: "essay",
    isWrong: false,
  },
  {
    rowNumber: "#5",
    answer:
      "Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante",
    answerType: "essay",
    isWrong: false,
  },
];

let input = `LEMBAR JAWABAN\n(1). (A) B C D ##\n(2). A B (C) D ##\n(3). A B C (D) ##\n(4). A (B) C D ##\n(5). A B (C) D ##\n(6). A B (C) D ##\n(7). A (B) C D ##\n(8). A B C (D) ##\n(9). (A) B C D ##\n(10) A (B) C D ##\nESSAY\n(#1) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus.\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dianissim ante\n(#2) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante\n(#3) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dianissim ante\n(#4) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante\n(#5) Lorem ipsum dolor sit amet, consectetur\nadipiscing elit. Sed sagittis velit arcu, non\nporttitor lorem euismod et. Donec tellus\nlacus, varius at commodo convallis,\ncondimentum id erat. Fusce sollicitudin nunc\nvitae magna sollicitudin in dignissim ante`;

// let output = ocrAdapter(input);
// console.log(output);
// i want output to same as expected

let expectedOut = {
  pg: {
    1: "value",
    2: "value",
    3: "value",
    4: "value",
    5: "value",
    6: "value",
    7: "value",
    8: "value",
    9: "value",
    10: "value",
  },
  essay: {
    1: "value",
    2: "value",
    3: "value",
    4: "value",
    5: "value",
  },
};
