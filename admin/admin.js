import {

    db,

    collection,

    getDocs

} from "../firebase.js";

loadResponses();

async function loadResponses() {

    const querySnapshot = await getDocs(collection(db, "responses"));

    const table = document.getElementById("tableBody");

    table.innerHTML = "";

    querySnapshot.forEach((doc) => {

        const data = doc.data();

table.innerHTML += `

<tr>

<td>${data.candidateName}</td>

<td>${data.rollNumber}</td>

<td>${data.score}</td>

<td>${data.correct}</td>

<td>${data.wrong}</td>

<td>

<button
class="viewBtn"
onclick="viewResponse('${doc.id}')">

👁 View

</button>

</td>

</tr>

`;

    });

}
window.viewResponse = function(id){

    window.location.href = `view.html?id=${id}`;

}