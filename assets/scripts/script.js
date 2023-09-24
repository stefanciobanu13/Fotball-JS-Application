import {
  clasament,
  resetClasamentValue,
  sortClasament,
  buildClasament,
  updateClasament,
} from "./clasament.js";


import { countNonNullLi, removeDeleteButtons } from "./helpers.js";
import { table , clearTable} from "./table.js";

sortClasament();
buildClasament(clasament);
sortClasament();

var addedDivs = [];
function addFinalsTeam(clasament) {
  var finalaMica = document.getElementById("finala-mica");
  var finalaMare = document.getElementById("finala-mare");

  const echipaStangaFinalaMica = finalaMica.children[0].children[0].children[0];

  const echipaDreaptaFinalaMica =
    finalaMica.children[0].children[2].children[0];

  const echipaStangaFinalaMare = finalaMare.children[0].children[0].children[0];
  const echipaDreaptaFinalaMare =
    finalaMare.children[0].children[2].children[0];

  const numeEchipaStangaFinalaMica = document.createElement("div");
  numeEchipaStangaFinalaMica.classList.add(clasament[2].culoare);
  numeEchipaStangaFinalaMica.textContent = clasament[2].culoare;
  echipaStangaFinalaMica.appendChild(numeEchipaStangaFinalaMica);

  const numeEchipaDreaptaFinalaMica = document.createElement("div");
  numeEchipaDreaptaFinalaMica.classList.add(clasament[3].culoare);
  numeEchipaDreaptaFinalaMica.textContent = clasament[3].culoare;
  echipaDreaptaFinalaMica.appendChild(numeEchipaDreaptaFinalaMica);

  const numeEchipaStangaFinalaMare = document.createElement("div");
  numeEchipaStangaFinalaMare.classList.add(clasament[0].culoare);
  numeEchipaStangaFinalaMare.textContent = clasament[0].culoare;
  echipaStangaFinalaMare.appendChild(numeEchipaStangaFinalaMare);

  const numeEchipaDreaptaFinalaMare = document.createElement("div");
  numeEchipaDreaptaFinalaMare.classList.add(clasament[1].culoare);
  numeEchipaDreaptaFinalaMare.textContent = clasament[1].culoare;
  echipaDreaptaFinalaMare.appendChild(numeEchipaDreaptaFinalaMare);

  // lista ul pentru echipa stânga în finala mică
  const ulEchipaStangaFinalaMica = document.createElement("ul");
  ulEchipaStangaFinalaMica.id = "marcatori-stanga";
  ulEchipaStangaFinalaMica.classList.add("list-" + clasament[2].culoare);
  echipaStangaFinalaMica.appendChild(ulEchipaStangaFinalaMica);

  // lista ul pentru echipa dreapta în finala mică
  const ulEchipaDreaptaFinalaMica = document.createElement("ul");
  ulEchipaDreaptaFinalaMica.id = "marcatori-dreapta";
  ulEchipaDreaptaFinalaMica.classList.add("list-" + clasament[3].culoare);
  echipaDreaptaFinalaMica.appendChild(ulEchipaDreaptaFinalaMica);

  // lista ul pentru echipa stânga în finala mare
  const ulEchipaStangaFinalaMare = document.createElement("ul");
  ulEchipaStangaFinalaMare.id = "marcatori-stanga";
  ulEchipaStangaFinalaMare.classList.add("list-" + clasament[0].culoare);
  echipaStangaFinalaMare.appendChild(ulEchipaStangaFinalaMare);

  // lista ul pentru echipa dreapta în finala mare
  const ulEchipaDreaptaFinalaMare = document.createElement("ul");
  ulEchipaDreaptaFinalaMare.id = "marcatori-dreapta";
  ulEchipaDreaptaFinalaMare.classList.add("list-" + clasament[1].culoare);
  echipaDreaptaFinalaMare.appendChild(ulEchipaDreaptaFinalaMare);

  // make the table centered
  const table = document.querySelector("table");

  table.style.marginLeft = "auto";
  table.style.marginRight = "auto";
  
  addedDivs.push(numeEchipaStangaFinalaMica);
  addedDivs.push(numeEchipaDreaptaFinalaMica);
  addedDivs.push(numeEchipaStangaFinalaMare);
  addedDivs.push(numeEchipaDreaptaFinalaMare);

  addedDivs.push(ulEchipaStangaFinalaMica);
  addedDivs.push(ulEchipaDreaptaFinalaMica);
  addedDivs.push(ulEchipaStangaFinalaMare);
  addedDivs.push(ulEchipaDreaptaFinalaMare);
}

addFinalsTeam(clasament);

// listener to the forms submit event
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return true;
});

// Add event listener to delete-button
table.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    const cell = event.target.parentNode;
    removeValue(cell);
  }
});

//screen the table data
export const dataPlayer = [];

const getDataButton = document.getElementById("getDataButton");
getDataButton.addEventListener("click", function () {
  const rows = table.getElementsByTagName("tr");
  const columns = table.getElementsByTagName("th");

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    const rowData = {};

    for (let j = 0; j < cells.length; j++) {
      const columnName = columns[j].innerText.trim();
      const cellContent = cells[j].innerText.trim();
      rowData[columnName] = cellContent;
    }

    dataPlayer.push(rowData);
  }

  console.log(dataPlayer);
  getDataButton.remove();
  removeDeleteButtons();
});

// afisare recomandari
function afiseazaRecomandari(etapa, searchTerm) {
  var recomandari = [];
  for (var i = 0; i < dataPlayer.length; i++) {
    var matchData = dataPlayer[i];
    for (var key in matchData) {
      if (matchData[key].toLowerCase().includes(searchTerm.toLowerCase())) {
        recomandari.push(matchData[key]);
      }
    }
  }

  var recomandariList = document.getElementById("recomandari" + etapa);
  recomandariList.innerHTML = "";
  recomandari.forEach(function (recomandare) {
    var li = document.createElement("li");
    li.textContent = recomandare;
    // listener pentru cand apesi pe o obtiune dintr-o lista
    li.addEventListener("click", function () {
      document.getElementById("searchInput" + etapa).value = recomandare;
      recomandariList.innerHTML = "";
    });
    recomandariList.appendChild(li);
  });
}

function parseButtons() {
  document.getElementById("button1").addEventListener("click", function () {
    addValueToList(1);
  });

  document.getElementById("button2").addEventListener("click", function () {
    addValueToList(2);
  });

  document.getElementById("button3").addEventListener("click", function () {
    addValueToList(3);
  });

  document.getElementById("button4").addEventListener("click", function () {
    addValueToList(4);
  });

  document.getElementById("button5").addEventListener("click", function () {
    addValueToList(5);
  });

  document.getElementById("button6").addEventListener("click", function () {
    addValueToList(6);
  });

  document.getElementById("button7").addEventListener("click", function () {
    addValueToList(7);
  });
}

parseButtons();

function addValueToList(etapa) {
  var searchValue;
  var selectElement;
  switch (etapa) {
    case 1:
      searchValue = document.getElementById("searchInput1").value;
      selectElement = document.getElementById("selectare1");
      break;
    case 2:
      searchValue = document.getElementById("searchInput2").value;
      selectElement = document.getElementById("selectare2");
      break;
    case 3:
      searchValue = document.getElementById("searchInput3").value;
      selectElement = document.getElementById("selectare3");
      break;
    case 4:
      searchValue = document.getElementById("searchInput4").value;
      selectElement = document.getElementById("selectare4");
      break;
    case 5:
      searchValue = document.getElementById("searchInput5").value;
      selectElement = document.getElementById("selectare5");
      break;
    case 6:
      searchValue = document.getElementById("searchInput6").value;
      selectElement = document.getElementById("selectare6");
      break;
    case 7:
      searchValue = document.getElementById("searchInput7").value;
      selectElement = document.getElementById("selectare7");
      break;
  }

  // search value in dataPlayer
  for (var i = 0; i < dataPlayer.length; i++) {
    var matchData = dataPlayer[i];
    for (var key in matchData) {
      if (matchData[key] === searchValue) {
        var listClassName = "list-" + selectElement.value;
      
       
        
        var list = document.querySelector(
          "#etapa" + etapa + " ul." + listClassName
        );

        var matchInfo = document.querySelector(
          "#etapa" + etapa + " .match-info"
        );

        if (etapa == 7) {
          // daca e finala
          // trebuie sa creem ul-ul cu cele 4 culori

          console.log("finala" + matchInfo.children[0].children[0].textContent.replace(/\s+/g, ""));
          
      }

        var numeEchipaStanga =
          matchInfo.children[0].children[0].textContent.replace(/\s+/g, "");
        var numeEchipaDreapta =
          matchInfo.children[2].children[0].textContent.replace(/\s+/g, "");
        var echipaPlayer = key;

        var listItem = document.createElement("li");
        listItem.textContent = searchValue;

        // verificam daca golul este autogol
        // daca s-a dat vs echipei lui
        if (numeEchipaStanga === echipaPlayer) {
          // daca echipa din stanga e echipa jucatorului
          // verificam daca golul s-a dat la echipa din dreapta

          if (selectElement.value === numeEchipaDreapta) {
            // atunci e clar ca e autogol
            // logica de autogol

            listItem.textContent = searchValue + " ( autogol ) ";
            listItem.style.color = "red";
          }
        } else if (numeEchipaDreapta === echipaPlayer) {
          // daca echipa din dreapta e echipa jucatorului
          // verificam daca golul s-a dat la stanga din dreapta

          if (selectElement.value === numeEchipaStanga) {
            // atunci e clar ca e autogol
            // logica de autogol

            listItem.textContent = searchValue + " ( autogol ) ";
            listItem.style.color = "red";
          }
        }

        // delete button
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt", "delete-button");

        // delete button listener + update score
        deleteIcon.addEventListener("click", function () {
          list.removeChild(listItem);
          updateScoreMatch(etapa);
        });
        listItem.appendChild(deleteIcon);
        list.appendChild(listItem);

        updateScoreMatch(etapa);
      }
    }
  }
}

function attachInputEvent(etapa) {
  var searchInput = document.getElementById("searchInput" + etapa);
  var recomandariList = document.getElementById("recomandari" + etapa);

  // adaugam recomandari pentru input
  searchInput.addEventListener("input", function () {
    var searchTerm = this.value;
    afiseazaRecomandari(etapa, searchTerm);
  });

  // ascundem lista cand dam click in afara ei
  document.addEventListener("click", function (event) {
    var isClickInsideRecomandari = recomandariList.contains(event.target);
    var isClickInsideInput = searchInput.contains(event.target);
    if (!isClickInsideRecomandari && !isClickInsideInput) {
      recomandariList.innerHTML = "";
    }
  });
}

for (var etapa = 1; etapa <= 7; etapa++) {
  attachInputEvent(etapa);
}

// functie care va fii utilizata pentru actualizarea scorului fiecarui meci
function updateScoreMatch(etapa) {
  resetClasamentValue();
  clearTable();

  const matches = document.querySelectorAll(".match");
  matches.forEach((match) => {
    const leftTeamGoalsUl = match.querySelector(".left-team-info ul");
    const rightTeamGoalsUl = match.querySelector(".right-team-info ul");

    const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
    const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

    const scoreElement = match.querySelector(".scor");
    scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;

    updateClasament(match);
  }, this);

  sortClasament();
  buildClasament(clasament);
  sortClasament();

  removeFinalsTeams();

  addFinalsTeam(clasament);

  const finale = document.querySelectorAll(".finala");
  finale.forEach((finala) => {
    const leftTeamGoalsUl = finala.querySelector(".left-team-info ul");
    const rightTeamGoalsUl = finala.querySelector(".right-team-info ul");

    const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
    const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

    const scoreElement = finala.querySelector(".scor");
    scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;
  }, this);

  removeTableRows("golgheteryBody");
  removeTableRows("autogolgheteriBody");

  populateGolgheteryTable();
  populateAutogolgheteriTable();
}





function removeFinalsTeams() {
  for (var i = 0; i < addedDivs.length; i++) {
    var div = addedDivs[i];
    div.parentNode.removeChild(div);
  }
  addedDivs = [];
}

function removeTableRows(tableId) {
  var table = document.getElementById(tableId);
  if (table) {
    var rows = table.getElementsByTagName("tr");

    for (var i = rows.length - 1; i >= 0; i--) {
      table.deleteRow(i);
    }
  }
}

function addGoalScorerRows(names, finalGoals, total) {
  const tableBody = document.getElementById("golgheteryBody");

  tableBody.innerHTML = "";

  // Filter out players with a total of 0
  const filteredData = names
    .map((name, index) => ({
      name,
      finalGoals: finalGoals[index],
      total: total[index],
    }))
    .filter((data) => data.total > 0);

  // Sort filtered data in descending order based on the 'total' value
  const sortedData = filteredData.sort((a, b) => b.total - a.total);

  // Loop through the sorted data and add rows to the table
  sortedData.forEach((data, index) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${index + 1}</td>
    <td>${data.name}</td>
    <td>${data.finalGoals}</td>
    <td>${data.total}</td>
    `;
    tableBody.appendChild(newRow);
  });
}

function addAutoGoalsScorers(names, total) {
  const tableBody = document.getElementById("autogolgheteriBody");

  tableBody.innerHTML = "";

  // Map the names and total to include " (autogol)" for each name
  const autoGoalsData = names.map((name, index) => ({
    name: `${name}`,
    total: total[index],
  }));

  // Filter out players with a total of 0
  const filteredData = autoGoalsData.filter((data) => data.total > 0);

  // Sort filtered data in descending order based on the 'total' value
  const sortedData = filteredData.sort((a, b) => b.total - a.total);

  // Loop through the sorted data and add rows to the table
  sortedData.forEach((data, index) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${data.name}</td>
      <td>${data.total}</td>
    `;
    tableBody.appendChild(newRow);
  });
}

function calculateTotalFinala(names) {
  const ulEchipaStangaFinalaMica = document.querySelector(
    "#finala-mica .left-team-info ul"
  );
  const ulEchipaDreaptaFinalaMica = document.querySelector(
    "#finala-mica .right-team-info ul"
  );
  const ulEchipaStangaFinalaMare = document.querySelector(
    "#finala-mare .left-team-info ul"
  );
  const ulEchipaDreaptaFinalaMare = document.querySelector(
    "#finala-mare .right-team-info ul"
  );

  const allLists = [
    ulEchipaStangaFinalaMica,
    ulEchipaDreaptaFinalaMica,
    ulEchipaStangaFinalaMare,
    ulEchipaDreaptaFinalaMare,
  ];

  const nameOccurrences = {};

  // initailize 0
  names.forEach((name) => {
    nameOccurrences[name] = 0;
  });

  // Count occurrences of names in the ul lists
  allLists.forEach((ul) => {
    const liElements = ul.querySelectorAll("li");
    liElements.forEach((li) => {
      const playerName = li.textContent.trim();
      if (nameOccurrences.hasOwnProperty(playerName)) {
        nameOccurrences[playerName]++;
      }
    });
  });

  const occurrencesVector = names.map((name) => nameOccurrences[name]);
  return occurrencesVector;
}

function calculateTotalEtapeFinala(names) {
  const allLists = document.querySelectorAll(
    ".list-Verde, .list-Portocaliu, .list-Albastru, .list-Gri"
  );

  const nameOccurrences = {};

  // Initialize 0
  names.forEach((name) => {
    nameOccurrences[name] = 0;
  });

  // Count occurrences of names in the ul lists
  allLists.forEach((ul) => {
    const liElements = ul.querySelectorAll("li");
    liElements.forEach((li) => {
      const playerName = li.textContent.trim();
      if (nameOccurrences.hasOwnProperty(playerName)) {
        nameOccurrences[playerName]++;
      }
    });
  });

  const occurrencesVector = names.map((name) => nameOccurrences[name]);

  return occurrencesVector;
}

function calculateAutogoals(names) {
  const allLists = document.querySelectorAll(
    ".list-Verde, .list-Portocaliu, .list-Albastru, .list-Gri"
  );

  const nameOccurrences = {};

  // Initialize 0
  names.forEach((name) => {
    nameOccurrences[name] = 0;
  });

  // Count occurrences of names in the ul lists
  allLists.forEach((ul) => {
    const liElements = ul.querySelectorAll("li");
    liElements.forEach((li) => {
      const playerName = li.textContent.trim();
      const cleanedPlayerName = playerName.replace("( autogol )", "").trim();

      // Check if the player name contains "autogol"
      if (playerName.toLowerCase().includes("autogol")) {
        if (nameOccurrences.hasOwnProperty(cleanedPlayerName)) {
          nameOccurrences[cleanedPlayerName]++;
        }
      }
    });
  });

  const occurrencesVector = names.map((name) => nameOccurrences[name]);

  return occurrencesVector;
}

function createDataPlayerName() {
  var data12 = [];
  for (var i = 0; i < dataPlayer.length; i++) {
    var matchData = dataPlayer[i];
    for (var key in matchData) {
      data12.push(matchData[key]);
    }
  }

  return data12;
}

function populateGolgheteryTable() {
  var dataPlayerName = createDataPlayerName();
  var dataPlayerFInala = calculateTotalFinala(dataPlayerName);
  var dataPlayerEtapeFinala = calculateTotalEtapeFinala(dataPlayerName);

  addGoalScorerRows(dataPlayerName, dataPlayerFInala, dataPlayerEtapeFinala);
}

function populateAutogolgheteriTable() {
  var dataPlayerName = createDataPlayerName();
  var dataPlayerEtapeFinala = calculateAutogoals(dataPlayerName);

  addAutoGoalsScorers(dataPlayerName, dataPlayerEtapeFinala);
}
