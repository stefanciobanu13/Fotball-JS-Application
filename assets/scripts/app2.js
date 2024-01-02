import { postRound, postGoals } from "./postRequests.js";

const selectPlayerBtn = document.getElementById("button_selectPlayer");
const saveFormBtn = document.getElementById("salveazaEditie")



let url = `https://iacademy2.oracle.com/ords/footballapp/psbd/jucatori/`;

selectPlayerBtn.addEventListener("click", () => {
 console.log('inside event listener')
 const input = document.getElementById("input_selectPlayer");

 // Clear the input value
 input.value = "";
});

function clearData(event) {
 const btn = document.getElementById('btnId');
 console.log(`the btn is ${btn}`)
 btn.innerHTML = "";
}

function getPlayers() {
    //get the players and populate the drop down list of players
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.response).items;

            const playersList = document.getElementById("playersList");
            response.forEach(player => {

                const option = document.createElement('option');
                option.value = `${player.nume} ${player.prenume}`;
                playersList.appendChild(option);
            });
        }
    };
}

async function saveTheForm() {
 postRound();
}

saveFormBtn.addEventListener("click", saveTheForm);
getPlayers();





















































