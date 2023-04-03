// const ocrAdapter
module.exports = (input) => {
  const essaySeparator = "ESSAY";

  // Split input into parts using the essay separator
  const inputParts = input.split(essaySeparator);

  // Extract the answers from the first part
  const answerPart = inputParts[0];
  const answers = answerPart.split("\n").slice(1, -1);

  // Extract the essay answers from the second part
  const essayPart = inputParts[1];
  const essayAnswers = essayPart.match(/#\d+\s+([\s\S]*?)(?=\n#|$)/g) || [];

  // Map each answer to an object
  const answerObjects = answers.map((answer) => {
    const match = answer.match(/^\((\d+)\)\.((?:\s*[A-D](?=\s))+)##$/);
    if (!match) {
      throw new Error(`Invalid answer format: ${answer}`);
    }
    return {
      rowNumber: parseInt(match[1]),
      answer: match[2].trim(),
      answerType: "pg",
      isWrong: /\([^()]*\)/.test(match[2]),
    };
  });

  // Map each essay answer to an object
  const essayAnswerObjects = essayAnswers.map((essayAnswer, index) => {
    return {
      rowNumber: `#${index + 1}`,
      answer: essayAnswer.trim(),
      answerType: "essay",
      isWrong: false,
    };
  });

  // Combine the answer objects and essay answer objects into one array
  const result = [...answerObjects, ...essayAnswerObjects];

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
