import { exam } from "../data/questions.js";
import { db, collection, addDoc } from "../firebase.js";

const reviewContainer = document.getElementById("reviewContainer");
const reviewDashboard = document.getElementById("reviewDashboard");

const answeredCount = document.getElementById("answeredCount");
const unansweredCount = document.getElementById("unansweredCount");
const reviewCount = document.getElementById("reviewCount");
const totalCount = document.getElementById("totalCount");

const viewUnansweredBtn = document.getElementById("viewUnansweredBtn");
const viewReviewBtn = document.getElementById("viewReviewBtn");
const viewAnsweredBtn = document.getElementById("viewAnsweredBtn");
const viewAllBtn = document.getElementById("viewAllBtn");
const backBtn = document.getElementById("backBtn");
const finalSubmitBtn = document.getElementById("finalSubmitBtn");
const searchSection = document.getElementById("searchSection");
const searchQuestion = document.getElementById("searchQuestion");
const omrPreviewBtn = document.getElementById("omrPreviewBtn");
const omrContainer = document.getElementById("omrContainer");
const omrContent = document.getElementById("omrContent");
const backFromOmrBtn = document.getElementById("backFromOmrBtn");
const responses =
JSON.parse(localStorage.getItem("responses")) || {};

loadDashboard();
viewUnansweredBtn.onclick = () => {

    const unanswered = [];

    exam.questions.forEach((question,index)=>{

        const answer = responses[index]?.answer;

        if(answer===null || answer===undefined){

            unanswered.push(index);

        }

    });

    reviewDashboard.style.display = "none";
    reviewContainer.style.display = "block";
    searchSection.style.display = "block";
    renderReview(unanswered);

};
viewReviewBtn.onclick = () => {

    const reviewQuestions = [];

    exam.questions.forEach((question, index) => {

        if (responses[index]?.review) {

            reviewQuestions.push(index);

        }

    });

    reviewDashboard.style.display = "none";
    reviewContainer.style.display = "block";
    searchSection.style.display = "block";
    renderReview(reviewQuestions);

};
viewAnsweredBtn.onclick = () => {

    const answeredQuestions = [];

    exam.questions.forEach((question, index) => {

        const answer = responses[index]?.answer;

        if (answer !== null && answer !== undefined) {

            answeredQuestions.push(index);

        }

    });

    reviewDashboard.style.display = "none";
    reviewContainer.style.display = "block";
    searchSection.style.display = "block";
    renderReview(answeredQuestions);

};
viewAllBtn.onclick = () => {

    const allQuestions = [];

    exam.questions.forEach((question, index) => {

        allQuestions.push(index);

    });

    reviewDashboard.style.display = "none";
    reviewContainer.style.display = "block";
    searchSection.style.display = "block";
    renderReview(allQuestions);

};
function loadDashboard(){

    let answered = 0;
    let unanswered = 0;
    let review = 0;

    exam.questions.forEach((question,index)=>{

        const answer = responses[index]?.answer;

        if(answer===null || answer===undefined){

            unanswered++;

        }else{

            answered++;

        }

        if(responses[index]?.review){

            review++;

        }

    });

    answeredCount.textContent = answered;
    unansweredCount.textContent = unanswered;
    reviewCount.textContent = review;
    totalCount.textContent = exam.questions.length;

}
function renderReview(questionIndexes){

    reviewContainer.innerHTML = "";

    questionIndexes.forEach(index=>{

    const question = exam.questions[index];

        const answer =
        responses[index]?.answer;

let status = "🔴";
if(responses[index]?.review){

    status = "🟡";

}
else if(answer!==null && answer!==undefined){

    status = "🟢";

}

        const letters=["A","B","C","D"];

        reviewContainer.innerHTML += `

<div class="reviewCard" data-question="${index + 1}">

    <div class="reviewTop">

        <h3>

            ${status} Question ${index+1}

        </h3>

    </div>

    <div class="reviewMiddle">

        ${
            answer==null

            ? `<span class="notAnswered">

                Not Attempted

               </span>`

            : `<span class="selectedAnswer">

                Selected Answer : ${letters[answer]}

               </span>`
        }

    </div>

    <button

        class="openQuestion"

        data-question="${index}"

    >

        ➜ Open Question

    </button>

</div>

`;
    });

    document
    .querySelectorAll(".openQuestion")
    .forEach(item=>{

        item.onclick=function(){

            localStorage.setItem(

                "jumpQuestion",

                this.dataset.question

            );

            window.location.href="exam.html";

        };

    });

}
function renderOMR(){

    omrContent.innerHTML = "";

    const letters = ["A","B","C","D"];

    for(let i=0;i<exam.questions.length;i++){

        const answer = responses[i]?.answer;

        omrContent.innerHTML += `

        <div class="omrRow">

            <div class="omrNumber">

                ${i+1}

            </div>

            ${letters.map((letter,index)=>`

                <div class="omrBubble ${answer===index?"selectedBubble":""}">

                    ${letter}

                </div>

            `).join("")}

        </div>

        `;

    }

}

backBtn.onclick = () => {

    if(reviewContainer.style.display==="block"){

        reviewContainer.style.display="none";
        searchSection.style.display = "none";
        searchQuestion.value = "";
        reviewDashboard.style.display="block";

        return;

    }

    localStorage.setItem(
        "returnToReview",
        "true"
    );

    window.location.href="exam.html";

};
omrPreviewBtn.onclick=()=>{

    reviewDashboard.style.display="none";

    omrContainer.style.display="block";

    renderOMR();

};
backFromOmrBtn.onclick = () => {

    omrContainer.style.display = "none";

    reviewDashboard.style.display = "block";

};

finalSubmitBtn.onclick = async () => {

    const confirmSubmit = confirm(
        "Are you sure you want to submit your exam?\n\nYou cannot change your answers after submission."
    );

    if (!confirmSubmit) return;

    let score = 0;
    let correct = 0;
    let wrong = 0;
    let notAttempted = 0;

    exam.questions.forEach((question, index) => {

        const studentAnswer = responses[index]?.answer;

        if (studentAnswer === null || studentAnswer === undefined) {

            notAttempted++;

        } else if (studentAnswer === question.answer) {

            correct++;
            score += 4;

        } else {

            wrong++;

        }

    });

    await addDoc(
        collection(db, "responses"),
        {
            candidateName: localStorage.getItem("candidateName"),
            rollNumber: localStorage.getItem("rollNumber"),
            examCode: localStorage.getItem("examCode"),

            score,
            correct,
            wrong,
            notAttempted,

            responses,

            submittedAt: new Date().toISOString()
        }
    );

    alert("✅ Exam Submitted Successfully!");

    localStorage.removeItem("responses");
    localStorage.removeItem("jumpQuestion");
    localStorage.removeItem("returnToReview");

    window.location.href = "thankyou.html";

};
searchQuestion.addEventListener("input", () => {

    const value = Number(searchQuestion.value);

    document.querySelectorAll(".reviewCard").forEach(card => {

        const questionNumber = Number(card.dataset.question);

        if (!value || questionNumber === value) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});