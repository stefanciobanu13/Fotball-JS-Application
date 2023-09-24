import { postRound, postGoals } from "./postRequests.js";

const url = "http://localhost:8083/players";
const selectPlayerBtn = document.getElementById("button_selectPlayer");
const saveFormBtn = document.getElementById("salveazaEditie")

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
 axios.get(url).then(response => {
  console.log(response);
  const playersList = document.getElementById("playersList");
  response.data.forEach(player => {
   const option = document.createElement('option');
   option.value = `${player.firstName}${player.lastName}`;
   playersList.appendChild(option);
  });
 });
}

async function saveTheForm() {
 postRound();
}

saveFormBtn.addEventListener("click", saveTheForm);
getPlayers();





















































