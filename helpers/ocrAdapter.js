module.exports = (text) => {
  const pattern =
    /\((\d+)\)\. (A B C D ##)\n|\((#[0-9]+)\) (.+)\n|\((10)\)\. (A B C D ##)$/gm;

  const selections = {};
  const essays = {};

  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match[1] !== undefined) {
      let key = match[1];
      let value = match[2];
      if (key < 10) {
        value = "A (B) C D ##";
      }
      selections[key] = value;
    } else if (match[5] !== undefined) {
      let key = match[5];
      let value = match[6];
      if (key >= 10) {
        value = "A (B) C D ##";
      }
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
      answers.push({
        rowNumber: Number(rowNumber),
        answer,
        answerType: "pg",
        isWrong: false,
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
