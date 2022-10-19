//setting our environment variables
var cardTitle = $(".card-title");
var cardText = $(".card-text");
var startBtn = $("#start-btn");
var timerTxt = $("#timer");
var scoresText = $("#scores-text");
var leaderBoard = {};
var currentQuestion = 0;
var timer;
var timeleft = 100;
var score = 0;

//a list of quiz questions/answers that can be added to, the rest of the code adapts to the array length. The final numeric value is the index of the correct answer
var questions = 
{
    "What does HTML Stand for?" : [["Hyper Text Markup Language", "High Tide Makes Low", "HTML", "Hello Text Marker Line"], 0],
    "Arrays in JavaScript can be used to store" : [["Arrays", "Strings", "Numbers", "All of these"], 3],
    "Which of these is a commonly used data type?" : [["C++", "Database", "String", "Printer"], 2],
    "String values must be enclosed in what symbol?" : [["Brackets", "Quotations", "Parentheses", "Exclamations"], 1]
};

//updates the score list and prints it to the html modal
function updateScores()
{
    leaderBoard = JSON.parse(localStorage.getItem("mav-quiz-leaderboard"));
    if (leaderBoard == null) leaderBoard = {};
    var lbText = JSON.stringify(leaderBoard, undefined, 2).replace(/[{}]/g, '');
    scoresText.text(lbText);
}

//initializes the quiz
function quizStart()
{
    currentQuestion = 0;
    updateQuestions();
    timeleft = 100;
    score = 0;
    timer = setInterval((tick), 1000);
}

//called when time runs out, quiz will fail and the user is ineligible for score saving
function quizFail()
{
    clearInterval(timer);
    cardTitle.text("Quiz Failed");
    cardText.text("You have depleted the allowed time for this quiz. Press begin to try again.");
    startBtn[0].style.display = "";
}

//called when the last question is answered, processes score and offers saving
function quizComplete()
{
    clearInterval(timer);
    cardTitle.text("Quiz Complete");
    cardText.text("You have completed the quiz with a score of: " + score);
    cardText.append(`</br><p id="save-prompt">Enter your name to save your score:</br><input id="name" type="text" style="display:inline; width:70%"></input><span id="save-btn" class="btn btn-secondary">Save</span></br></br>Or, press begin to try again.</p>`);
    startBtn[0].style.display = "";
}

//1 second tick, decrements the timer
function tick()
{
    if(timeleft > 0)
    {
        timeleft--; 
        timerTxt.text("Time Remaining: " + timeleft);
    }
    else
    {
        quizFail();
    }
}

//changes the question and options
function updateQuestions()
{
    cardTitle.text("Question " + (currentQuestion + 1));
    cardText.text(Object.keys(questions)[currentQuestion]);
    for (var i = 0; i < Object.values(questions).length; i++)
    {
        var answer = Object.values(questions)[currentQuestion][0][i];
        cardText.append(`</br><span num="` + i + `" class="answer btn btn-primary">` + answer + "</span>");
    }
    cardText.append("</br>Score: " + score);
}

//checks if there are more questions to update to
function nextQuestion()
{
    if (currentQuestion < Object.values(questions).length - 1)
    {
        currentQuestion++;
        updateQuestions();
    } 
    else quizComplete();
}

//checks if the selected answer is correct
function checkAnswer(q, a)
{
    if (Object.values(questions)[currentQuestion][1] == a)
    {
        score++
    }

    nextQuestion();
}

//called when the start button is clicked
startBtn.click(function()
    {
        this.style.display = "none";
        quizStart();
    }
);

//called when any answer option is clicked
$(document).on('click', '.answer', function(event){
    checkAnswer(currentQuestion, $(this).attr('num'));
});

//called when the save score button is clicked
$(document).on('click', '#save-btn', function(event){
    updateScores();
    var newName = $("#name").val();
    Object.assign(leaderBoard, {[newName] : score});
    localStorage.setItem("mav-quiz-leaderboard", JSON.stringify(leaderBoard));
    updateScores();
    var del = document.getElementById("save-prompt")
    del.parentNode.removeChild(del);
});

//called when the "view high scores" button is clicked
$(document).on('click', '#high-scores', function(event){
    updateScores();
});