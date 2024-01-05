import { jucatori2} from "../scripts/app2.js";

const jucatori = jucatori2

export const table = document.getElementById("teams");

// Create an array to store the added players
let addedPlayers = [];

let devMode = false;

// Function to populate the table with a player
export function populateTable(value) {
  const table = document.getElementById("teams");
  const emptyPosition = findFirstEmptyPosition();

  // Check if the player is already added
  if (addedPlayers.includes(value)) {
    //alert('Jucatorul exista deja in lista de prezenta');
    return;
  }

  if (emptyPosition) {
    const { row, column } = emptyPosition;
    const cell = table.rows[row].cells[column];

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt", "delete-button");

    deleteIcon.addEventListener("click", function () {
      cell.innerHTML = "";
      // Remove the player from the array when deleted from the table
      const index = addedPlayers.indexOf(value);
      if (index > -1) {
        addedPlayers.splice(index, 1);
      }
    });

    cell.innerHTML = "";
    cell.textContent = value;

    cell.appendChild(deleteIcon);

    document.getElementById("input_selectPlayer").focus();
    document.getElementById("input_selectPlayer").value = '';

    // Add the player to the array
    addedPlayers.push(value);
  }
}

// Function to populate the table with a random player in dev mode
export function populateTableDevMode() {
  if (devMode) {
    // Replace this with your logic to fetch random players from the database
    const randomPlayer = getRandomPlayerFromDatabase();
    populateTable(randomPlayer);
  } else {
    if(!devMode)
      alert('Dev mod is not enabled')
  }
}

// Function to get a random player from the database (replace this with your logic)
function getRandomPlayerFromDatabase() {
  // Replace this with your logic to fetch a random player from the database
  const randomPlayers = jucatori // Sample players
  const randomIndex = Math.floor(Math.random() * randomPlayers.length);
  return randomPlayers[randomIndex];
}


export function clearTable() {
  var table = document.getElementById("clasamentBody");
  table.innerHTML = "";
}


export const submitButton = document.getElementById("button_selectPlayer");
submitButton.addEventListener("click", function () {
  const input = document.getElementById("input_selectPlayer");
  const selectedValue = input.value;


  devMode = document.getElementById("devModeSwitch").checked;

  if (devMode){
    for(var i = 1; i <= 24 ; i++){
      populateTableDevMode();
    }
  }
  else{
    populateTable(selectedValue);
  }

});



export function checkTableContent() {
  const table = document.getElementById("teams");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      const cellContent = cells[j].innerText.trim();
      if (cellContent === "") {
        return false;
      }
    }
  }
  return true;
}

export function findFirstEmptyPosition() {
  const table = document.getElementById("teams");
  const rows = table.getElementsByTagName("tr");

  for (let j = 0; j < rows[0].cells.length; j++) {
    for (let i = 0; i < rows.length; i++) {
      const cellContent = rows[i].cells[j].innerText.trim();
      if (cellContent === "") {
        return { row: i, column: j };
      }
    }
  }

  return null;
}
