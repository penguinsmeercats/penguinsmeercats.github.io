var quizQandAs = {};
var timer = "";
var answerTDs = [];

function quizClassicOnloadFunction(){
  let quiztable = '<table style="width: 100%;">';
  let questionsarray = [];
  let answersarray = [];
  let quiztimeSecs = quizdata.timeInSecs % 60;
  let quiztimeMins = (quizdata.timeInSecs - quiztimeSecs) / 60;
  let quizwidth = Number(quizdata.columnwidths[0]) + Number(quizdata.columnwidths[1]);
  let quizcol1width = (Number(quizdata.columnwidths[0]) / quizwidth) * 100;
  let quizcol2width = (Number(quizdata.columnwidths[1]) / quizwidth) * 100;
  quizcol1width = quizcol1width.toFixed(0);
  quizcol2width = quizcol2width.toFixed(0);
  console.log(quizcol1width,quizcol2width);
  document.querySelector(".quiztimer").innerText = quiztimeMins + ":" + leadingZero(quiztimeSecs);
  document.querySelector(".quiztimer").dataset.secondsRemaining = quizdata.timeInSecs;
  for(i=0; i<quizdata.questionsAnswers.length; i++){
    let line = '<tr><td class="question" style="width:' + quizcol1width + '%">' + quizdata.questionsAnswers[i][0] + '</td><td class="answer" style="width:' + quizcol2width + '%"></td></tr>';
    quiztable += line;
    questionsarray.push(quizdata.questionsAnswers[i][0]);
    answersarray.push(quizdata.questionsAnswers[i][1]);
    let plusone = i + 1;
    console.log(plusone, quizdata.columns, plusone%quizdata.columns);
  }
  document.querySelector(".quiztablediv").style.columnCount = quizdata.columns;
  //console.log(quiztable, questionsarray, answersarray, quiztimeSecs, quiztimeMins);
  quiztable += "</table>";
  document.querySelector(".quiztablediv2").innerHTML = quiztable;
  answerTDs = document.querySelectorAll(".quiztablediv td.answer");
  console.log(answerTDs)
  let answerbank = [];
  for(i=0; i<answersarray.length; i++){
    let splitanswers = answersarray[i].toUpperCase().split("/");
    answerbank.push(...splitanswers);
  }
  quizQandAs.answerbank = "|" + answerbank.join("|") + "|";
  console.log(quizQandAs);
  document.querySelector(".quizquestion").innerText = quizdata.title;
  checkAnswers();
}

function startquiz(){
  document.querySelector(".quizinput").style.display = "inline-block";
  document.querySelector(".quizendquiz").style.display = "inline-block";
  document.querySelector(".quizstartquiz").style.display = "none";
  document.querySelector(".quizinput").focus();
  starttimer();
}

function starttimer(){
  timer = setInterval(countdown,1000);
}
function countdown(){
  let totalsecsRem = Number(document.querySelector(".quiztimer").dataset.secondsRemaining) - 1;
  if(totalsecsRem == 0){
    document.querySelector(".quiztimer").innerText = "0:00";
    endquiz();
  } else {
    let secsRem = totalsecsRem % 60;
    let minsRem = (totalsecsRem - secsRem) / 60;
    document.querySelector(".quiztimer").innerText = minsRem + ":" + leadingZero(secsRem);
    document.querySelector(".quiztimer").dataset.secondsRemaining = totalsecsRem;
  }
}

function checkAnswers(){
  let guess = document.querySelector(".quizinput").value.toUpperCase();
  //console.log(guess);
  if(quizQandAs.answerbank.indexOf("|" + guess.trim() + "|") > -1){
    for(i=0; i<quizdata.questionsAnswers.length; i++){
      let possibleanswers = quizdata.questionsAnswers[i][1].split("/");
      let possibleanswers2 = quizdata.questionsAnswers[i][1].toUpperCase().split("/");
      let possibleremove = possibleanswers2.join("|")+ "|";
      //console.log(possibleanswers);
      //console.log(possibleremove);
      for(j=0; j<possibleanswers.length; j++)
      if(possibleanswers[j].toUpperCase() == (guess)){
        answerTDs[i].innerText = possibleanswers[0];
        answerTDs[i].classList.add("correct");
        quizQandAs.answerbank = quizQandAs.answerbank.replaceAll(possibleremove,"");
      }
      console.log(quizQandAs.answerbank);
      document.querySelector(".quizinput").value = "";
    }
  }
  let correctguesses = document.querySelectorAll(".quiztable td.answer.correct");
  let correctpercentage = ((correctguesses.length / answerTDs.length) * 100);
  correctpercentage = correctpercentage.toFixed(0);
  let newscore = correctguesses.length + "/" + answerTDs.length + " " + correctpercentage + "%";
  document.querySelector(".quizscore").innerText = newscore;
  if(correctguesses.length == answerTDs.length){
    endquiz();
  }
}

function endquiz(){
  clearInterval(timer);
  document.querySelector(".quizinput").disabled = true;
  document.querySelector(".quizinput").style.background = "#444";
}

function leadingZero(seconds){
  let toReturn;
  if(seconds<10){
    toReturn = "0" + seconds;
  } else {
    toReturn = seconds;
  }
  return toReturn
}


window.onload = quizClassicOnloadFunction();

console.log("Quiz engine loaded succesfully");
