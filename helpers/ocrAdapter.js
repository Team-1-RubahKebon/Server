module.exports = (text, question) => {
  // const pattern =
  //   /\((\d+)\)\. (A B C D ##)\n|\((#[0-9]+)\) (.+)\n|\((10)\)\. (A B C D ##)$/gm;
  // const selections = {};
  // const essays = {};
  // let match;
  // while ((match = pattern.exec(text)) !== null) {
  //   if (match[1] !== undefined) {
  //     let key = match[1];
  //     let value = match[2];
  //     if (key < 10) {
  //       value = "A (B) C D ##";
  //     }
  //     selections[key] = value;
  //   } else if (match[5] !== undefined) {
  //     let key = match[5];
  //     let value = match[6];
  //     if (key >= 10) {
  //       value = "A (B) C D ##";
  //     }
  //     selections[key] = value;
  //   } else {
  //     const key = match[3];
  //     const value = match[4];
  //     essays[key] = value;
  //   }
  // }
  // const answers = [];
  // for (const rowNumber in selections) {
  //   const answerText = selections[rowNumber];
  //   if (answerText.includes("(")) {
  //     const answer = answerText.match(/\(([A-D])\)/)[1];
  //     let isWrong = false;
  // question.forEach((el) => {
  //   if (el.rowNumber == rowNumber) {
  //     if (answer != el.keyword) {
  //       isWrong = true;
  //     }
  //   }
  // });
  //     answers.push({
  //       rowNumber: Number(rowNumber),
  //       answer,
  //       answerType: "pg",
  //       isWrong,
  //     });
  //   }
  // }
  // for (const rowNumber in essays) {
  //   const answer = essays[rowNumber];
  //   answers.push({
  //     rowNumber,
  //     answer,
  //     answerType: "essay",
  //     isWrong: false,
  //   });
  // }
  // return answers;

  const obj = {};

  // Split text into sections by regex
  const sections = text.split(/ESSAY/g);

  // Process multiple-choice questions
  const mcRegex = /\([0-9][0-9]?\)|\([0-9]\)/g;
  const choiceRegex = /\(([A-Za-z])\)/g;

  const mcSection = sections[0];
  const mcMatches = mcSection.match(mcRegex);

  mcMatches.forEach((match) => {
    const num = match.replace(/[()]/g, "");
    const choices = [];
    let choiceMatch;

    while ((choiceMatch = choiceRegex.exec(match))) {
      choices.push(choiceMatch[1]);
    }

    obj[num] = {
      answerType: "pg",
      choices,
    };
  });

  // Process essay questions
  const essayRegex = /#\d+/g;

  sections.slice(1).forEach((section) => {
    const numMatch = section.match(essayRegex);
    const num = numMatch[0].replace("#", "");
    const answer = section.substring(numMatch[0].length).trim();

    obj[num] = {
      answerType: "essay",
      answer,
    };
  });

  return obj;
};
