module.exports = (text, question) => {
  const pattern = /\(\d+\)\. \(\w+\) ##\n|(?:#\d+) .+\n|\(10\)\. \(\w+\) ##$/gm;

  const selections = {};
  const essays = {};

  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match[1] !== undefined) {
      let key = match[1];
      let value = match[2];

      selections[key] = value;
    } else if (match[5] !== undefined) {
      let key = match[5];
      let value = match[6];

      selections[key] = value;
    } else {
      const key = match[3];
      const value = match[4];
      essays[key] = value;
    }
  }

  const answers = [];

  for (const rowNumber in selections) {
    const answerText = selections[rowNumber];

    if (answerText.includes("(")) {
      const answer = answerText.match(/\(([A-D])\)/)[1];

      let isWrong = false;

      question.forEach((el) => {
        if (el.rowNumber == rowNumber) {
          if (answer != el.keyword) {
            isWrong = true;
          }
        }
      });

      answers.push({
        rowNumber: Number(rowNumber),
        answer,
        answerType: "pg",
        isWrong,
      });
    }
  }

  for (const rowNumber in essays) {
    const answer = essays[rowNumber];
    answers.push({
      rowNumber,
      answer,
      answerType: "essay",
      isWrong: false,
    });
  }
  return answers;
};
