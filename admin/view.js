let allQuestions = [];
import { exam } from "../data/questions.js";

import {

    db,

    doc,

    getDoc

} from "../firebase.js";

const params = new URLSearchParams(window.location.search);

const documentId = params.get("id");

loadResponse();

async function loadResponse(){

    const documentRef = doc(db,"responses",documentId);

    const documentSnap = await getDoc(documentRef);

    if(!documentSnap.exists()){

        alert("Response not found.");

        return;

    }

    const data = documentSnap.data();
    allQuestions = [];

    document.getElementById("candidate").innerHTML =
        "Candidate : " + data.candidateName;

    document.getElementById("roll").innerHTML =
        "Roll Number : " + data.rollNumber;

    document.getElementById("score").innerHTML =
        "Score : " + data.score;
    const container = document.getElementById("responseContainer");

container.innerHTML = "";
for (const questionId in data.responses) {

    const response = data.responses[questionId];

const question = exam.questions[Number(questionId)];

if (!question) {
    console.warn("Question not found:", questionId);
    continue;
}

const letters = ["A", "B", "C", "D"];

const studentAnswer =
response.answer == null
    ? "Not Attempted"
    : letters[response.answer];

const correctAnswer =
letters[question.answer];

    let status = "";

    if (studentAnswer === "Not Attempted") {

        status = "⏭ Not Attempted";

    }

    else if (studentAnswer === correctAnswer) {

        status = "✅ Correct";

    }

    else {

        status = "❌ Wrong";

    }

    allQuestions.push({

        questionId,

        studentAnswer,

        correctAnswer,

        status

    });

}
renderQuestions(allQuestions);
}
function renderQuestions(list) {

    const container = document.getElementById("responseContainer");

    container.innerHTML = "";

    list.forEach(item => {

        container.innerHTML += `

        <div class="questionCard">

            <h3>Question ${item.questionId}</h3>

            <p><strong>Student Answer:</strong> ${item.studentAnswer}</p>

            <p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>

            <p><strong>Status:</strong> ${item.status}</p>

            <hr>

        </div>

        `;

    });

}

window.filterQuestions = function(type) {
    console.log("Filter clicked:", type);
    console.log(allQuestions);

    if (type === "all") {

        renderQuestions(allQuestions);

    }

    else if (type === "correct") {

        renderQuestions(
            allQuestions.filter(q => q.status.includes("Correct"))
        );

    }

    else if (type === "wrong") {

        renderQuestions(
            allQuestions.filter(q => q.status.includes("Wrong"))
        );

    }

    else {

        renderQuestions(
            allQuestions.filter(q => q.status.includes("Not Attempted"))
        );

    }

};