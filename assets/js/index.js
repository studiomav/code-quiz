var cardTitle = $(".card-title");
var cardText = $(".card-text");
var startBtn = $("#start-btn");
var timerTxt = $("#timer");
var currentQuestion = 0;
var timer;
var timeleft = 100;
var score = 0;
var questions = 
{
    "What does HTML Stand for?" : [["Hyper Text Markup Language", "High Tide Makes Low", "HTML", "Hello Text Marker Line"], 0],
    "Arrays in JavaScript can be used to store" : [["Arrays", "Strings", "Numbers", "All of these"], 3],
    "Which of these is a commonly used data type?" : [["C++", "Database", "String", "Printer"], 2],
    "String values must be enclosed in what symbol?" : [["Brackets", "Quotations", "Parentheses", "Exclamations"], 1]
};

function quizStart()
{
    updateQuestions();
    timeleft = 100;
    score = 0;
    timer = setInterval((tick), 1000);
}

function quizFail()
{
    clearInterval(timer);
    cardTitle.text("Quiz Failed");
    cardText.text("You have depleted the allowed time for this quiz. Press begin to try again.");
    startBtn[0].style.display = "";
}

function quizComplete()
{
    clearInterval(timer);
    cardTitle.text("Quiz Complete");
    cardText.text("You have completed the quiz with a score of: " + score);
    startBtn[0].style.display = "";
}

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

function updateQuestions()
{
    cardTitle.text("Question " + (currentQuestion + 1));
    cardText.text(Object.keys(questions)[currentQuestion]);
    for (var i = 0; i < Object.values(questions).length; i++)
    {
        var answer = Object.values(questions)[currentQuestion][0][i];
        cardText.append(`</br><a href="#" num="` + i + `" class="answer btn btn-primary">` + answer + "</a>");
    }
    cardText.append("</br>Score: " + score);
}

function nextQuestion()
{
    if (currentQuestion < Object.values(questions).length - 1)
    {
        currentQuestion++;
        updateQuestions();
    } 
    else quizComplete();
}

function checkAnswer(q, a)
{
    if (Object.values(questions)[currentQuestion][1] == a)
    {
        score++
    }

    nextQuestion();
}

startBtn.click(function()
    {
        this.style.display = "none";
        quizStart();
    }
);

$(document).on('click', '.answer', function(event){
    checkAnswer(currentQuestion, $(this).attr('num'));
});