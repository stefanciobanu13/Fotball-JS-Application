import * as cls from "./clasament.js";
import {clearTable} from "./table.js"
import { countNonNullLi } from "./helpers.js";
import * as script from "./script.js";
import { buildGolgheteri } from "./golgheteri.js";

// Get the edition number from the URL
const urlParams = new URLSearchParams(window.location.search);
const numar_editie = urlParams.get("id");

cls.sortClasament();
cls.buildClasament(cls.clasament);
cls.sortClasament();

const colorClasses = {
  Portocaliu: "orange",
  Verde: "green",
  Albastru: "blue",
  Gri: "grey",
};

// Load edition information using the edition number
var xhttp = new XMLHttpRequest();
let url = `https://iacademy2.oracle.com/ords/footballapp/psbd/editii/${numar_editie}`;
xhttp.open("GET", url, true);
xhttp.send();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var result = JSON.parse(this.response);
    console.log(result);
    // Mapping of colors to class names for table cells
    const playerData = result.items;

    displayEditionDetails(playerData[0]);

    document.title = `Editia ${numar_editie}`

    // Get the table element
    var table = document.getElementById("teams");
    const links = {};
    // Initialize columns array
    var columns = {};
    Object.keys(colorClasses).forEach(function (color) {
      columns[color] = [];
      console.log(color)
      links[color] = (`https://cezarovici.github.io/noteaza_jucatori.htm?id=${numar_editie}&culoare_echipa=${colorClasses[color]}`)
    });

    console.log(links)

//<a href="https://www.w3schools.com">Visit W3Schools</a>

    const marcatori = {};
    const marcatori_finale = {};
  

    // Loop through the players and populate the columns
    playerData.forEach(function (player) {
        if (player.stare_jucator === "Prezent") {
          columns[player.culoare_echipa].push(player.nume_jucator);
          console.log(colorClasses[player.culoare_echipa],player.nume_jucator)

        } else {
          const targetMarcatori = player.numar_meci < 13 ? marcatori : marcatori_finale;
          const keyExists = targetMarcatori[player.numar_meci];
      
          if (!keyExists) {
            targetMarcatori[player.numar_meci] = `${player.numar_goluri_marcate}_${player.nume_jucator}_${player.culoare_echipa}`;
          } else {
            targetMarcatori[player.numar_meci] += `, ${player.numar_goluri_marcate}_${player.nume_jucator}_${player.culoare_echipa}`;
          }
        }
    });
      
    addElementsToUl(links,'noteaza_jucatori')

    console.log(marcatori);
    console.log(marcatori_finale)

    processMarcatori(marcatori,marcatori_finale)


    // Find the maximum length among columns
    var maxLength = Math.max(
      ...Object.values(columns).map((arr) => arr.length)
    );

    // Populate the table using columns
    for (var i = 0; i < maxLength; i++) {
      var row = table.insertRow(-1);
      Object.keys(columns).forEach(function (color) {
        var cell = row.insertCell(-1);
        cell.textContent = columns[color][i] || "";
        cell.className = colorClasses[color];
      });
    }
  }

  updateScoreMatch();
};

async function updateMatches(){
    const matches = document.querySelectorAll(".match");
    
    matches.forEach((match) => {  
    const leftTeamGoalsUl = match.querySelector(".left-team-info ul");
    const rightTeamGoalsUl = match.querySelector(".right-team-info ul");

    const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
    const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

    const scoreElement = match.querySelector(".scor");
    scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;
    }, this);
}

// Function to process marcatori for matches
async function processMarcatoriMatches(marcatori) {
    for (const [key, values] of Object.entries(marcatori)) {
      const info_meci = values.split(",");
      // Filter players for match 1 and the green team
      console.log(info_meci);
  
      info_meci.forEach((info_marcator) => {
        info_marcator = info_marcator.split("_");
        console.log("info: " + info_marcator);
  
        var meci;
  
        if (key <= 12) {
          meci = document.getElementById(`match${key}`);
          console.log(meci)
        }
  
        if (meci) {
          for (let nr_goals = 1; nr_goals <= info_marcator[0]; nr_goals++) {
            adaugaJucatorInList(
              meci,
              info_marcator[0],
              info_marcator[1],
              info_marcator[2],
              key
            );
          }
        }
      });
    }
  }
  
  // ... (rest of the existing code)
  
  // Function to process marcatori for finals
  async function processMarcatoriFinals(marcatori_finale) {
    for (const [key, values] of Object.entries(marcatori_finale)) {
      const info_meci = values.split(",");
      // Filter players for match 1 and the green team
      console.log(info_meci);
  
      info_meci.forEach((info_marcator) => {
        info_marcator = info_marcator.split("_");
        console.log("info: " + info_marcator);
  
        var meci;
  
        if (key == 13) {
          meci = document.querySelector('#finala-mica')
        } else {
          meci = document.querySelector('#finala-mare')
        }
  
        console.log(meci,key)
  
        if (meci) {
          for (let nr_goals = 1; nr_goals <= info_marcator[0]; nr_goals++) {
            adaugaJucatorInList(
              meci,
              info_marcator[0],
              info_marcator[1],
              info_marcator[2],
              key
            );
          }
        }
      });
    }
  }
  
  // Ensure sequential execution using async/await
  async function processMarcatori(marcatori, marcatori_finale) {
    await processMarcatoriMatches(marcatori);
    await updateMatches();
    await processMarcatoriFinals(marcatori_finale);
    await script.updateFinals();
    await buildGolgheteri();
}
  



// Function to display the edition details
function displayEditionDetails(edition) {
  var date_picker = document.getElementById("data_editie");
  date_picker.value = edition.data_editie;
  date_picker.disabled = true;

  var nr_editie = document.getElementById("numar_editie");
  nr_editie.value = edition.numar_editie;
  nr_editie.disabled = true;

  console.log(edition.data_editie, edition.numar_editie);
}

function adaugaJucatorInList(matchInfo, numar_goluri, nume, culoare, nr_meci) {
  var listClassName = "list-" + culoare;
  const list = matchInfo.querySelector(`ul.${listClassName}`)
  console.log(matchInfo)
  console.log(list)

  var echipaPlayer = culoare;

  var numeEchipaStanga = matchInfo.children[0].children[0].textContent.replace(
    /\s+/g,
    ""
  );
  var numeEchipaDreapta = matchInfo.children[0].children[2].textContent.replace(
    /\s+/g,
    ""
  );
  var echipaPlayer = culoare;

  var listItem = document.createElement("li");
  listItem.textContent = nume;

  // verificam daca golul este autogol
  // daca s-a dat vs echipei lui
  if (numeEchipaStanga === echipaPlayer) {
    // daca echipa din stanga e echipa jucatorului
    // verificam daca golul s-a dat la echipa din dreapta

    if (culoare === numeEchipaDreapta) {
      // atunci e clar ca e autogol
      // logica de autogol

      listItem.textContent = searchValue + " ( autogol ) ";
      listItem.style.color = "red";
    }
  } else if (numeEchipaDreapta === echipaPlayer) {
    // daca echipa din dreapta e echipa jucatorului
    // verificam daca golul s-a dat la stanga din dreapta

    if (culoare === numeEchipaStanga) {
      // atunci e clar ca e autogol
      // logica de autogol

      listItem.textContent = searchValue + " ( autogol ) ";
      listItem.style.color = "red";
    }
  }

  
  if(list)
    list.appendChild(listItem);
}

function updateScoreMatch() {
    cls.resetClasamentValue();
    clearTable();
  
    const matches = document.querySelectorAll(".match");
    matches.forEach((match) => {
      const leftTeamGoalsUl = match.querySelector(".left-team-info ul");
      const rightTeamGoalsUl = match.querySelector(".right-team-info ul");
  
      const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
      const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);
  
      const scoreElement = match.querySelector(".scor");
      scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;
  
      cls.updateClasament(match);
    }, this);
  
    cls.sortClasament();
    cls.buildClasament(cls.clasament);
    cls.sortClasament();
  
    script.removeFinalsTeams();
    script.addFinalsTeam(cls.clasament);
  
    script.removeTableRows("golgheteryBody");
    script.removeTableRows("autogolgheteriBody");
  
    script.populateGolgheteryTable();
    script.populateAutogolgheteriTable();
  }

  

  /**
   * 
   * @param {Object.<string,string>} elements 
   * @param {string} ulId 
   */
  function addElementsToUl(elements, ulId) {
    var ul = document.getElementById(ulId);

    // Verifică dacă UL există înainte de a adăuga elementele
    
    if (ul) {
        Object.entries(elements).forEach(function([color,link]) {
            const a = document.createElement("a");
            a.classList.add("list-group-item")
            a.classList.add(colorClasses[color])

            
            a.textContent = `Evalueaza jucatorii de la echipa ${color}`;
            a.href = link;

            ul.appendChild(a);
        });
    } else {
        console.error("UL element not found with the specified ID.");
    }
}




