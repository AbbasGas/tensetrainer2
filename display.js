var display = {
  f: {},
  buttonDiv: document.getElementById('buttons'),
  outputDiv: document.getElementById('output'),
  wordsDiv: document.getElementById('words'),
  descriptionDiv: document.getElementById('description'),
  theRestDiv: document.getElementById('theRest'),
  punctuationDiv: document.getElementById('punctuation'),
  timeExprDiv: document.getElementById('time-expr'),
  currentWord: 0,
  output: [],
  buttonArray: {},
  outputHolder: "",
  tempF: {}

}

display.init = function(myForm) {
  this.f = myForm;
  this.theRestDiv.textContent = this.f.theRest;
}

display.setUpButtons = function() {

  //labels and IDs for buttons
  this.buttonArray = {};

    this.buttonArray[ENUM.is] = "is";
    this.buttonArray[ENUM.am] = "am";
    this.buttonArray[ENUM.are] = "are";
    this.buttonArray[ENUM.do] = "do";
    this.buttonArray[ENUM.did] = "did";
    this.buttonArray[ENUM.does] = "does";
    this.buttonArray[ENUM.was]  = "was";
    this.buttonArray[ENUM.were]  = "were";
    this.buttonArray[ENUM.s]  = "-s";
    this.buttonArray[ENUM.have]  = "have";
    this.buttonArray[ENUM.has]  = "has";
    this.buttonArray[ENUM.BFV]  = this.f.BFV;
    this.buttonArray[ENUM.not]  = "not";
    this.buttonArray[ENUM.ing]  = "-ing";
    this.buttonArray[ENUM.ed]  = "-ed";
    this.buttonArray[ENUM.subj] = this.f.sentence['Subj'];

  if (this.f.isIrreg) {
    this.buttonArray[ENUM.irreg] = this.f.SPast;
  }

  // clear buttons, if any
  while (this.buttonDiv.firstChild) {
    this.buttonDiv.removeChild(this.buttonDiv.firstChild);
  }

  for (var item in this.buttonArray) {

      var btn = document.createElement("Button");
      btn.textContent = display.buttonArray[item];

      btn.onclick = (function(i){
        return function(){
          display.buttonPressed(i);
        }
      })(item);



      display.buttonDiv.appendChild(btn);
    };

  // Get the first word out of form before first
  // button is pressed.
  if (this.currentWord === 0) {
    this.currentWord = form.getWord();
  }
}


display.buttonPressed = function (userWordID) {
  var correct = false;
  if (userWordID == this.currentWord) {


    this.outputWord(userWordID);

    if (form.newForm) {
      correct = true;
      if (correct) {this.showCorrect();}
      //this.setUpForm();
      //this.output = [];


    }

    if (form.newSentence) {

      display.init(form);
      display.setUpButtons();

    }


    // make a deep copy of form object so that you can display
    // object data after the non-temp one changes to the
    // next sentence data

    this.tempF = JSON.parse(JSON.stringify(this.f));


    this.currentWord = form.getWord();


    return;
  }
  this.showWrong();
}

display.setUpForm = function () {
  // end game of game
  if (this.f.done) {
    console.log("all done!! good job.");
    document.write("You have won the whole Internet");
    return;
  }

  this.descriptionDiv.textContent = form.formName;
  this.timeExprDiv.textContent = this.f.timeExpr;

  this.wordsDiv.textContent = this.f.sentence['Subj']+ "/" +
    this.f.BFV;
  if (this.f.isNegative) {
    this.wordsDiv.textContent += "/not";
  }

  if (this.f.isQuestion) {
    this.punctuationDiv.textContent = "?";
  }
  else {
    this.punctuationDiv.textContent = ".";
   }



}

display.outputWord = function(id) {

  var currentWord, nextWord, wordCount;
  var SPres = this.tempF.SPres;
  var SPast = this.tempF.SPast;
  var ingForm = this.tempF.ingForm;

  this.output.push(id);

  this.outputDiv.textContent = "";
  for (wordCount = 0;wordCount < this.output.length;wordCount++) {
    currentWord = this.output[wordCount];
    nextWord = this.output[parseInt(wordCount)+1];


    // Put words together before displaying them
    if (nextWord == ENUM.s && currentWord == ENUM.BFV) {
      this.outputDiv.textContent += SPres;
      wordCount++; // advance over the -s so we don't print it
    } else if (currentWord == ENUM.do && nextWord == ENUM.not) {
      this.outputDiv.textContent += "don't";
      wordCount++; // advance over the 'not' so we don't print it
    } else if (currentWord == ENUM.does && nextWord == ENUM.not) {
      this.outputDiv.textContent += "doesn't";
      wordCount++; // advance over the 'not' so we don't print it
    } else if (currentWord == ENUM.did && nextWord == ENUM.not) {
      this.outputDiv.textContent += "didn't";
      wordCount++; // advance over the 'not' so we don't print it
    } else if (currentWord == ENUM.BFV && nextWord == ENUM.ing) {
      this.outputDiv.textContent += ingForm;
      wordCount++; // advance over the 'not' so we don't print it
    } else if (currentWord == ENUM.is && nextWord == ENUM.not) {
      this.outputDiv.textContent += "isn't";
      wordCount++; // advance over the 'not' so we don't print it
    } else if (currentWord == ENUM.are && nextWord == ENUM.not) {
      this.outputDiv.textContent += "aren't";
      wordCount++; // advance over the 'not' so we don't print it
    } else if (currentWord == ENUM.BFV && nextWord == ENUM.ed) {
      this.outputDiv.textContent += SPast;
      wordCount++; // advance over the '-ed' so we don't print it
    } else {
      // capitalize first word
      if (parseInt(wordCount) === 0) {
        var str;
        str = this.buttonArray[this.output[wordCount]];
        this.outputDiv.textContent +=
              str.charAt(0).toUpperCase() + str.slice(1);
      } else {
        this.outputDiv.textContent += this.buttonArray[this.output[wordCount]];
      }
    }
    this.outputHolder = this.outputDiv.textContent;

    this.outputDiv.textContent += " ";
  }

  if (this.f.newForm) {
    //this.outputDiv.textContent = "";
  }
}

// show message when user gets to the end of the sentence
display.showCorrect = function() {
  var el = document.getElementById('correct');
  el.style.visibility = 'visible';
  el.style.color = 'green';
  // el.textContent = this.outputHolder;
  el.textContent = "Correct!!";


  setTimeout( function () {
    document.getElementById('correct').style.visibility = 'hidden';
    //document.getElementById('output'). textContent = "";
    display.setUpForm();
    display.output = [];
    display.outputDiv.textContent = "";
  }, 2000);


}

display.showWrong = function() {
  var el = document.getElementById('correct');
  el.style.visibility = 'visible';
  el.style.color = 'red';
  el.textContent = "No. Try again.";

  setTimeout( function () {
    document.getElementById('correct').style.visibility = 'hidden';
  }, 2000);


}
