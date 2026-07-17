import { exam } from "../data/questions.js";
import { db, collection, addDoc } from "../firebase.js";

const reviewContainer = document.getElementById("reviewContainer");
const backBtn = document.getElementById("backBtn");
const finalSubmitBtn = document.getElementById("finalSubmitBtn");

const responses =
JSON.parse(localStorage.getItem("responses")) || {};

renderReview();

function renderReview(){

    reviewContainer.innerHTML = "";

    exam.questions.forEach((question,index)=>{

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

        let omr="";

        for(let i=0;i<4;i++){

            if(answer===i){

                omr+=`●${letters[i]} `;

            }

            else{

                omr+=`○${letters[i]} `;

            }

        }

        reviewContainer.innerHTML+=`

        <div class="reviewRow">

            <span
            class="jumpQuestion"
            data-question="${index}">

            ${status}
            Q${index+1}

            </span>

            <span style="width:50px;display:inline-block;">

            ${answer==null?"--":letters[answer]}

            </span>

            <span>

            ${omr}

            </span>

        </div>

        <hr>

        `;

    });

    document
    .querySelectorAll(".jumpQuestion")
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
backBtn.onclick = () => {

    localStorage.setItem(

    "returnToReview",

    "true"

);

window.location.href="exam.html";

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