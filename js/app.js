let responses = {};

const loginBtn = document.getElementById("loginBtn");

if(loginBtn){

loginBtn.addEventListener("click",function(){

const name =
document.getElementById("name").value.trim();

const roll =
document.getElementById("roll").value.trim();

const code =
document.getElementById("code").value.trim();

if(name=="" || roll=="" || code==""){

alert("Please fill all the fields.");

return;

}

localStorage.setItem("candidateName",name);

localStorage.setItem("rollNumber",roll);

localStorage.setItem("examCode",code);

window.location.href="instruction.html";

});

}
const agree = document.getElementById("agree");

if(agree){

document.getElementById("candidate").innerHTML =
localStorage.getItem("candidateName");

document.getElementById("rollNumber").innerHTML =
localStorage.getItem("rollNumber");

document.getElementById("examCode").innerHTML =
localStorage.getItem("examCode");

document.getElementById("welcome").innerHTML =
"Welcome, " + localStorage.getItem("candidateName") + " 👋";

agree.addEventListener("change",function(){

document.getElementById("startExam").disabled = !this.checked;

});

document.getElementById("startExam").addEventListener("click",function(){

window.location.href="exam.html";

});

}
const questionsContainer = document.getElementById("questionsContainer");

if (questionsContainer) {

    document.getElementById("examTitle").innerHTML = exam.title;

    document.getElementById("examSubject").innerHTML = exam.subject;

    exam.questions.forEach((question, index) => {

        responses[question.id] = {
            answer: null
        };

        let card = document.createElement("div");

        card.className = "questionCard";

        card.innerHTML = `

        <h3>Question ${index + 1}</h3>

        <p>${question.question}</p>

        <label>
            <input type="radio" name="q${question.id}" value="A">
            A. ${question.options[0]}
        </label>

        <label>
            <input type="radio" name="q${question.id}" value="B">
            B. ${question.options[1]}
        </label>

        <label>
            <input type="radio" name="q${question.id}" value="C">
            C. ${question.options[2]}
        </label>

        <label>
            <input type="radio" name="q${question.id}" value="D">
            D. ${question.options[3]}
        </label>

        <hr>

        `;

        questionsContainer.appendChild(card);

    });

    document.querySelectorAll("input[type='radio']").forEach(radio => {

        radio.addEventListener("change", function () {

            const questionId = Number(this.name.replace("q", ""));

            responses[questionId].answer = this.value;

            console.log(responses);

        });

    });

}
const submitBtn = document.getElementById("submitBtn");

if (submitBtn) {

    submitBtn.addEventListener("click", function () {

        let score = 0;
        let correct = 0;
        let wrong = 0;
        let notAttempted = 0;

        exam.questions.forEach(question => {

            const studentAnswer = responses[question.id].answer;

            if (studentAnswer === null) {

                notAttempted++;

            }

            else if (studentAnswer === question.answer) {

                correct++;

                score += 4;

            }

            else {

                wrong++;

            }

        });

        localStorage.setItem("score", score);
        localStorage.setItem("correct", correct);
        localStorage.setItem("wrong", wrong);
        localStorage.setItem("notAttempted", notAttempted);

        window.location.href = "thankyou.html";

    });

}
const scoreBox = document.getElementById("score");

if (scoreBox) {

    scoreBox.innerHTML = "Score : " + localStorage.getItem("score");

    document.getElementById("correct").innerHTML =
    "Correct : " + localStorage.getItem("correct");

    document.getElementById("wrong").innerHTML =
    "Wrong : " + localStorage.getItem("wrong");

    document.getElementById("notAttempted").innerHTML =
    "Not Attempted : " + localStorage.getItem("notAttempted");

}