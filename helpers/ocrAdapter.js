// const ocrAdapter
module.exports = (input, question) => {
  input = input.split("\nESSAY\n");
  let result = [];
  let multipleAnswersPool = input[0];
  let essayPool = input[1];

  multipleAnswersPool = multipleAnswersPool.split("\n");
  for (let i = 1; i < multipleAnswersPool.length; i++) {
    let pg = {};
    let filteredQuestion = question.filter((el) => el.rowNumber == i);
    pg.isWrong = false;
    pg.rowNumber = i;
    pg.answer = answerLocator(multipleAnswersPool[i]);
    pg.answerType = "pg";
    console.log(filteredQuestion, pg.answer);
    if (filteredQuestion) {
      if (filteredQuestion[0]?.keyword != pg.answer) {
        pg.isWrong = true;
      }
    }
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
