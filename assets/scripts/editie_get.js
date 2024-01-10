import * as cls from "./clasament.js";
import {clearTable} from "./table.js"
import { countNonNullLi } from "./helpers.js";
import * as script from "./script.js";

// Get the edition number from the URL
const urlParams = new URLSearchParams(window.location.search);
const numar_editie = urlParams.get("id");

cls.sortClasament();
cls.buildClasament(cls.clasament);
cls.sortClasament();

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

    var colorClasses = {
      Portocaliu: "orange",
      Verde: "green",
      Albastru: "blue",
      Gri: "grey",
    };

    // Get the table element
    var table = document.getElementById("teams");

    // Initialize columns array
    var columns = {};
    Object.keys(colorClasses).forEach(function (color) {
      columns[color] = [];
    });

    const marcatori = {};

    // Loop through the players and populate the columns
    playerData.forEach(function (player) {
      if (player.stare_jucator === "Prezent")
        columns[player.culoare_echipa].push(player.nume_jucator);
      else if (!marcatori[player.numar_meci]) {
        // If the key doesn't exist, create it and set the value
        marcatori[
          player.numar_meci
        ] = `${player.numar_goluri_marcate}_${player.nume_jucator}_${player.culoare_echipa}`;
      } else {
        // If the key exists, append the value to the existing one
        marcatori[
          player.numar_meci
        ] += `, ${player.numar_goluri_marcate}_${player.nume_jucator}_${player.culoare_echipa}`;
      }
    });

    console.log(marcatori);

    for (const [key, values] of Object.entries(marcatori)) {
      const info_meci = values.split(",");
      // Filter players for match 1 and the green team
      console.log(info_meci);

      var meci;

      info_meci.forEach((info_marcator) => {
        info_marcator = info_marcator.split("_");
        console.log(info_marcator);

        if (key <= 12) {
          meci = document.getElementById(`match${key}`);
          console.log(meci.querySelector(`ul.list-${info_marcator[2]}`));
          for (var nr_goals = 1; nr_goals <= info_marcator[0]; nr_goals++)
            adaugaJucatorInList(
              meci,
              info_marcator[0],
              info_marcator[1],
              info_marcator[2],
              key
            );
        } else if (key == 13) meci = document.getElementById(`finala-mica`);
        else meci = document.getElementById(`finala-mare`);
      });
    }
    const matches = document.querySelectorAll(".match");
  
    matches.forEach((match) => {  
      const leftTeamGoalsUl = match.querySelector(".left-team-info ul");
      const rightTeamGoalsUl = match.querySelector(".right-team-info ul");

      const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
      const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

      const scoreElement = match.querySelector(".scor");
      scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;
    }, this);

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

  var list = document.querySelector(
    "#match" + nr_meci + " ul." + listClassName
  );

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

