// const ocrAdapter =
module.exports = (text) => {
  const rows = text.split("\n");
  const result = [];

  let answerType = "";
  let isWrong = false;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].trim();

    if (row.match(/^[A-G]\.$/)) {
      result.push({
        rowNumber: i + 1,
        answer: row.slice(0, -1),
        answerType: "mc",
        isWrong,
      });
    } else if (row.match(/^[\d]+[)\.]/)) {
      answerType = "essay";
      isWrong = false;

      result.push({
        rowNumber: row.split(".")[0],
        answer: row.slice(row.indexOf(")") + 1),
        answerType,
        isWrong,
      });
    } else if (row.match(/^x[\d]+[)\.]/)) {
      answerType = "essay";
      isWrong = true;

      result.push({
        rowNumber: row.split(".")[0].substring(1),
        answer: row.slice(row.indexOf(")") + 1),
        answerType,
        isWrong,
      });
    }
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
// i want output to same as expected
