import { exam } from "../data/questions.js";

let currentPage = 1;
const QUESTIONS_PER_PAGE = 10;

let responses =
JSON.parse(localStorage.getItem("responses")) || {};

exam.questions.forEach((q, index) => {

    if(!responses[index]){

responses[index] = {

    answer:null,

    review:false

};

    }

});

const questionsContainer = document.getElementById("questionsContainer");
const pageTitle = document.getElementById("pageTitle");
const pagePalette = document.getElementById("pagePalette");
const questionPalette = document.getElementById("questionPalette");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const reviewBtn = document.getElementById("reviewBtn");
const markReviewBtn = document.getElementById("markReviewBtn");

function renderPage(page) {

    questionsContainer.innerHTML = "";

    const start = (page - 1) * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, exam.questions.length);

    pageTitle.innerHTML = `Questions ${start + 1} - ${end}`;

    const pageQuestions = exam.questions.slice(start, end);

    pageQuestions.forEach((question, index) => {

        const questionIndex = start + index;

        const card = document.createElement("div");
        card.className = "questionCard";
        card.id = `question-${questionIndex}`;

        let optionsHTML = "";

        question.options.forEach((option, i) => {

            const letter = ["A", "B", "C", "D"][i];

optionsHTML += `

<label class="option">

    <input
        type="radio"
        name="q${questionIndex}"
        value="${i}"
        ${responses[questionIndex].answer == i ? "checked" : ""}>

    <span>${letter}. ${option}</span>

</label>

`;

        });

        card.innerHTML = `

            <h3>Question ${questionIndex + 1}</h3>

            <p>${question.question}</p>

            ${optionsHTML}

            <hr>


        `;

        questionsContainer.appendChild(card);

    });

    document.querySelectorAll("input[type='radio']").forEach(radio => {

        radio.addEventListener("change", function () {

            const id = Number(this.name.replace("q", ""));

            responses[id].answer = Number(this.value);
        localStorage.setItem(
    "responses",
    JSON.stringify(responses)
);
        });

    });
    buildQuestionPalette(start, end);
    buildPagePalette();
    

    prevBtn.disabled = currentPage === 1;

    const totalPages = Math.ceil(exam.questions.length / QUESTIONS_PER_PAGE);

if (currentPage === totalPages) {

    nextBtn.style.display = "none";

    submitBtn.style.display = "inline-block";

}
else{

    nextBtn.style.display = "inline-block";

    submitBtn.style.display = "none";

}
const jumpQuestion = Number(localStorage.getItem("jumpQuestion"));

if (!isNaN(jumpQuestion)) {

    const element = document.getElementById(`question-${jumpQuestion}`);

    if (element) {

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        element.style.border = "3px solid orange";

        setTimeout(() => {
            element.style.border = "";
        }, 2000);

    }

    localStorage.removeItem("jumpQuestion");

}

}

function buildPagePalette() {

    pagePalette.innerHTML = "";

    const totalPages = Math.ceil(exam.questions.length / QUESTIONS_PER_PAGE);

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement("button");
       

        btn.innerHTML = i;

btn.onclick = () => {

    currentPage = i;

    renderPage(currentPage);

};

        pagePalette.appendChild(btn);

    }

}
function buildQuestionPalette(start, end) {

    questionPalette.innerHTML = "";

    for (let i = start; i < end; i++) {

        const btn = document.createElement("button");

if (responses[i].review) {

    btn.style.background = "#ffc107";

}
else if (responses[i].answer !== null) {

    btn.style.background = "#28a745";

    btn.style.color = "white";

}

btn.innerHTML = i + 1;

        btn.onclick = () => {

    const element = document.getElementById(`question-${i}`);

    if (element) {

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        element.style.border = "3px solid #0d6efd";

        setTimeout(() => {

            element.style.border = "";

        }, 1500);

    }

};

        questionPalette.appendChild(btn);

    }

}

prevBtn.onclick = () => {

    if (currentPage > 1) {

        currentPage--;

        renderPage(currentPage);

    }

};

nextBtn.onclick = () => {

    const totalPages = Math.ceil(exam.questions.length / QUESTIONS_PER_PAGE);

    if (currentPage < totalPages) {

        currentPage++;

        renderPage(currentPage);

    } 

};
submitBtn.onclick = () => {

    alert("Firebase submission coming in the next milestone 🚀");

};

reviewBtn.onclick = () => {

    localStorage.setItem(
        "responses",
        JSON.stringify(responses)
    );

    localStorage.removeItem("returnToReview");

    window.location.href = "review.html";

};
const jumpQuestion =
Number(localStorage.getItem("jumpQuestion"));

if(!isNaN(jumpQuestion)){

    currentPage =
    Math.floor(jumpQuestion / QUESTIONS_PER_PAGE) + 1;

}
renderPage(currentPage);
markReviewBtn.onclick = () => {

    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = Math.min(start + QUESTIONS_PER_PAGE, exam.questions.length);

    for (let i = start; i < end; i++) {

        if (responses[i].answer !== null) {

            responses[i].review = !responses[i].review;

        }

    }

    localStorage.setItem(
        "responses",
        JSON.stringify(responses)
    );

    renderPage(currentPage);

};