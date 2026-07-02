const SERVER_URL = "";

let currentQuizId = null;
let responses = [];

let totalQuestions = 0;

let timeLeft = 0;
let timerInterval = null;

/* ===========================
   CREATE QUIZ
=========================== */

function createQuiz() {

    const category = document.getElementById("category").value.trim();
    const numQ = document.getElementById("numQ").value;
    const title = document.getElementById("title").value.trim();

    if (!category || !numQ || !title) {
        alert("Please fill all fields.");
        return;
    }

    fetch(`${SERVER_URL}/quiz/create?category=${category}&numQ=${numQ}&title=${title}`, {

        method: "POST"

    })
    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to create quiz");
        }

        return response.json();

    })
    .then(data => {

        document.getElementById("message").innerHTML =
        `
        <div class="success">
            Quiz Created Successfully!<br><br>
            Quiz ID : <strong>${data.id}</strong>
        </div>
        `;

    })
    .catch(error => {

        document.getElementById("message").innerHTML =
        `
        <div class="error">${error.message}</div>
        `;

    });

}


/* ===========================
   LOAD QUIZ
=========================== */

function loadQuiz() {

    currentQuizId = document.getElementById("quizId").value;

    if (!currentQuizId) {
        alert("Enter Quiz ID");
        return;
    }

    fetch(`${SERVER_URL}/quiz/get/${currentQuizId}`)

    .then(response => {

        if (!response.ok) {
            throw new Error("Quiz not found");
        }

        return response.json();

    })

    .then(data => {

        displayQuizQuestions(data);

    })

    .catch(error => {

        alert(error.message);

    });

}


/* ===========================
   DISPLAY QUESTIONS
=========================== */

function displayQuizQuestions(questions) {

    totalQuestions = questions.length;

    const container = document.getElementById("questions");

    container.innerHTML = "";

    responses = [];

    questions.forEach((q,index)=>{

        const card = document.createElement("div");

        card.className = "question";

        card.innerHTML =

        `
        <h3>${index+1}. ${q.questionTitle}</h3>

        <label class="option">
            <input type="radio"
                   name="${q.id}"
                   value="${q.option1}">
            ${q.option1}
        </label>

        <label class="option">
            <input type="radio"
                   name="${q.id}"
                   value="${q.option2}">
            ${q.option2}
        </label>

        <label class="option">
            <input type="radio"
                   name="${q.id}"
                   value="${q.option3}">
            ${q.option3}
        </label>

        <label class="option">
            <input type="radio"
                   name="${q.id}"
                   value="${q.option4}">
            ${q.option4}
        </label>

        `;

        container.appendChild(card);

    });

    const btn = document.createElement("button");

    btn.textContent = "Submit Quiz";

    btn.onclick = submitQuiz;

    container.appendChild(btn);

    startTimer(questions.length);

}


function startTimer(totalQuestions) {

    timeLeft = totalQuestions * 60;

    const timer = document.getElementById("timer");

    timerInterval = setInterval(() => {

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timer.innerHTML = `Time Left: ${minutes}:${seconds.toString().padStart(2,'0')}`;

        if (timeLeft <= 60) {
            timer.classList.add("danger");
        }

        if(timeLeft <= 0){
            clearInterval(timerInterval);
            submitQuiz();
        }

        timeLeft--;

    }, 1000);

}




/* ===========================
   SUBMIT QUIZ
=========================== */

function submitQuiz() {

    clearInterval(timerInterval);

    responses = [];

    const selectedOptions =
    document.querySelectorAll("input[type='radio']:checked");

    selectedOptions.forEach(option=>{

        responses.push({

            id:Number(option.name),

            response:option.value

        });

    });

    fetch(`${SERVER_URL}/quiz/submit/${currentQuizId}`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(responses)

    })

    .then(response=>{

        if(!response.ok){

            throw new Error("Failed to submit quiz");

        }

        return response.json();

    })

    .then(score=>{

        localStorage.setItem("score",score);

        localStorage.setItem("total",totalQuestions);

        window.location.href="result.html";

    })

    .catch(error=>{

        alert(error.message);

    });

}


/* ===========================
   RESULT PAGE
=========================== */

document.addEventListener("DOMContentLoaded",()=>{

    if(document.getElementById("score")){

        const score = localStorage.getItem("score");

        const total = localStorage.getItem("total");

        document.getElementById("score").innerHTML =
        `${score} / ${total}`;

    }

});


function addQuestion(){

    const question={

        category:document.getElementById("category").value,

        difficultyLevel:document.getElementById("difficulty").value,

        questionTitle:document.getElementById("questionTitle").value,

        option1:document.getElementById("option1").value,

        option2:document.getElementById("option2").value,

        option3:document.getElementById("option3").value,

        option4:document.getElementById("option4").value,

        rightAnswer:document.getElementById("rightAnswer").value

    };

    fetch(`${SERVER_URL}/question/addQuestion`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(question)

    })

    .then(()=>{

        alert("Question Added");

        clearForm();

        loadQuestions();

    });

}

function clearForm() {

    document.getElementById("category").value = "";
    document.getElementById("difficulty").value = "";
    document.getElementById("questionTitle").value = "";
    document.getElementById("option1").value = "";
    document.getElementById("option2").value = "";
    document.getElementById("option3").value = "";
    document.getElementById("option4").value = "";
    document.getElementById("rightAnswer").value = "";

    // Optional: Put the cursor back in the first field
    document.getElementById("category").focus();
}

function loadQuestions(){

    fetch(`${SERVER_URL}/question/allQuestions`)

    .then(res=>res.json())

    .then(data=>displayAllQuestions(data));

}

function loadCategoryQuestions(){

    const category=document
    .getElementById("searchCategory").value;

    fetch(`${SERVER_URL}/question/category/${category}`)

    .then(res=>res.json())

    .then(data=>displayAllQuestions(data));

}

function displayAllQuestions(questions){

    const container=document
    .getElementById("questions");

    container.innerHTML="";

    questions.forEach(q=>{

        container.innerHTML+=`

        <div class="question">

        <h3>${q.questionTitle}</h3>

        <p><b>Category:</b> ${q.category}</p>

        <p><b>Difficulty:</b> ${q.difficultyLevel}</p>

        <p><b>Option 1:</b> ${q.option1}</p>

        <p><b>Option 2:</b> ${q.option2}</p>

        <p><b>Option 3:</b> ${q.option3}</p>

        <p><b>Option 4:</b> ${q.option4}</p>

        <p><b>Correct Answer:</b> ${q.rightAnswer}</p>

        <button class="delete"
        onclick="deleteQuestion(${q.id})">

        Delete

        </button>

        </div>

        `;

    });

}

function deleteQuestion(id){

    fetch(`${SERVER_URL}/question/delete/${id}`,{

        method:"DELETE"

    })

    .then(()=>{

        loadQuestions();

    });

}


