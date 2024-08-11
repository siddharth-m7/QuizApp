let quizData = [];
let score = 0;
let answeredQuestions = 0;
let timer;
let timeLeft;

document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;

    // Set timer based on the number of questions
    timeLeft = amount * 30; // 30 seconds per question

    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

    if (category) apiUrl += `&category=${category}`;
    if (difficulty) apiUrl += `&difficulty=${difficulty}`;
    if (type) apiUrl += `&type=${type}`;

    fetchQuiz(apiUrl);
});

function fetchQuiz(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.response_code === 0) {
                quizData = data.results;
                displayQuiz(quizData);
                startTimer(); // Start the timer when displaying the quiz
            } else {
                document.getElementById('quiz').innerHTML = '<p>Error fetching quiz. Please try different options.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('quiz').innerHTML = '<p>An error occurred. Please try again later.</p>';
        });
}

function displayQuiz(questions) {
    const quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = '<h2>Your Quiz</h2>';

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        
        const answers = shuffleArray([...question.incorrect_answers, question.correct_answer]);
        
        questionElement.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${decodeEntities(question.question)}</p>
            <ul class="answers" data-question="${index}">
                ${answers.map((answer, i) => `
                    <li data-answer="${i}">${decodeEntities(answer)}</li>
                `).join('')}
            </ul>
        `;
        
        quizContainer.appendChild(questionElement);
    });

    document.querySelectorAll('.answers li').forEach(li => {
        li.addEventListener('click', selectAnswer);
    });
}

function selectAnswer(e) {
    const answerElement = e.target;
    const questionElement = answerElement.closest('.answers');
    
    if (answerElement.classList.contains('selected')) return;

    questionElement.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
    answerElement.classList.add('selected');

    const questionIndex = questionElement.getAttribute('data-question');
    const correctAnswerText = decodeEntities(quizData[questionIndex].correct_answer);
    if (answerElement.textContent === correctAnswerText) {
        answerElement.classList.add('correct');
    } else {
        answerElement.classList.add('incorrect');
        questionElement.querySelector(`li:contains('${correctAnswerText}')`).classList.add('correct');
    }

    // Check if all questions are answered
    answeredQuestions++;
    if (answeredQuestions === quizData.length) {
        clearInterval(timer);  // Stop the timer when all questions are answered       // Display the final score
    }
}

function checkAnswers() {
    clearInterval(timer);
    score = 0;
    answeredQuestions = 0;

    quizData.forEach((question, index) => {
        const questionElement = document.querySelector(`.answers[data-question="${index}"]`);
        const selectedAnswer = questionElement.querySelector('.selected');

        if (selectedAnswer) {
            answeredQuestions++;
            const selectedAnswerText = selectedAnswer.textContent;
            const correctAnswerText = decodeEntities(question.correct_answer);

            if (selectedAnswerText === correctAnswerText) {
                score++;
                selectedAnswer.classList.add('correct');
            } else {
                selectedAnswer.classList.add('incorrect');
                questionElement.querySelector(`li:contains('${correctAnswerText}')`).classList.add('correct');
            }
        }
    });

}



function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up!");
            checkAnswers();
        } else {
            timeLeft--;
            document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
        }
    }, 1000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function decodeEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}
