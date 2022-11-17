const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text')); 
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById("loader");
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("https://the-trivia-api.com/api/questions?categories=music&limit=10&difficulty=medium&tags=2022,2010's,00's,1990's")
  .then(response => {
    return response.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions);
    questions = loadedQuestions.map(loadedQuestions => {
      const formattedQuestion = {
        question: loadedQuestions.question
      };
      const answerChoices = [...loadedQuestions.incorrectAnswers];
      formattedQuestion.answer = Math.floor(Math.random()*3) +1;
      answerChoices.splice(formattedQuestion.answer - 1,0,loadedQuestions.correctAnswer);

     answerChoices.forEach((choice, index) => {
      formattedQuestion["choice" + (index + 1 )] = choice;
     })
     return formattedQuestion;
    })
    startGame();
      })

      
  .catch(err => {
    console.error(err);
  });

//CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}
getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;
        //update progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
      if (!acceptingAnswers) return;
  
      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];
  
      const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
  
      if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }
  
      selectedChoice.parentElement.classList.add(classToApply);
  
      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
    });
  });
  
  incrementScore = num => {
    score += num;
    scoreText.innerHTML = score;
  };
  
  
