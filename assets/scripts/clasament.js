import { getMatchInformations } from "./helpers.js";
import { getBetterTeamByDirectMatch } from "./match.js";

export var clasament = [
  {
    culoare: "Verde",
    meciuri_jucate: 0,
    victorii: 0,
    egaluri: 0,
    infrangeri: 0,
    goluri_date: 0,
    goluri_primite: 0,
    golaveraj: 0,
    punctaj: 0,
  },
  {
    culoare: `Portocaliu`,
    meciuri_jucate: 0,
    victorii: 0,
    egaluri: 0,
    infrangeri: 0,
    goluri_date: 0,
    goluri_primite: 0,
    golaveraj: 0,
    punctaj: 0,
  },
  {
    culoare: `Albastru`,
    meciuri_jucate: 0,
    victorii: 0,
    egaluri: 0,
    infrangeri: 0,
    goluri_date: 0,
    goluri_primite: 0,
    golaveraj: 0,
    punctaj: 0,
  },
  {
    culoare: `Gri`,
    meciuri_jucate: 0,
    victorii: 0,
    egaluri: 0,
    infrangeri: 0,
    goluri_date: 0,
    goluri_primite: 0,
    golaveraj: 0,
    punctaj: 0,
  },
];

console.log(clasament);

export var clasamentSelectiv = [
  { culoare: "Verde", vs_Portocaliu: 0, vs_Albastru: 0, vs_Gri: 0 },
  { culoare: "Portocaliu", vs_Verde: 0, vs_Albastru: 0, vs_Gri: 0 },
  { culoare: "Gri", vs_Portocaliu: 0, vs_Albastru: 0, vs_Verde: 0 },
  { culoare: "Albastru", vs_Portocaliu: 0, vs_Verde: 0, vs_Gri: 0 },
];

export function buildClasament(data) {
  var table = document.getElementById("clasamentBody");

  for (var i = 0; i < data.length; i++) {
    var row = `<tr>
                      <td>${i + 1}</td>
                      <td>${data[i].culoare}</td>
                      <td>${data[i].victorii}</td>
                      <td>${data[i].egaluri}</td>
                      <td>${data[i].infrangeri}</td>
                      <td>${data[i].goluri_date}</td>
                      <td>${data[i].goluri_primite}</td>
                      <td>${data[i].golaveraj}</td>
                      <td>${data[i].punctaj}</td>
                  </tr>`;
    table.innerHTML += row;
  }
}

// sort the clasament array by points
export function sortClasament() {
  clasament.sort(function (team1, team2) {
    if (team1.punctaj == team2.punctaj) {
      //console.log(team1,team2,getBetterTeamByDirectMatch(team1,team2));

      if (getBetterTeamByDirectMatch(team1, team2) == 0) {
        if (team1.golaveraj == team2.golaveraj) {
          if (team1.goluri_date == team2.goluri_date) {
            // change table loc with the name PENALTY
            var clasament1 = document.getElementById("clasamentBody");
            var rows = clasament1.querySelectorAll("tr");
            rows.forEach((row) => {
              const teamName = row.children[1].textContent.trim();
              if (teamName === team1.culoare) {
                row.children[0].textContent = "PENALTY";
                row.children[0].style.color = "red";
              } else if (teamName === team2.culoare) {
                row.children[0].textContent = "PENALTY";
                row.children[0].style.color = "red";
              }
            }, this);
            return 0;
          } else if (team1.goluri_date > team2.goluri_date) {
            return -1;
          } else {
            return 1;
          }
        } else if (team1.golaveraj > team2.golaveraj) {
          return -1;
        } else {
          return 1;
        }
      } else {
        return getBetterTeamByDirectMatch(team1, team2);
      }
    } else if (team1.punctaj > team2.punctaj) {
      return -1;
    } else {
      return 1;
    }
  });
}

export function updateClasament(match) {
  try {
    const matchInformations = getMatchInformations(match);
    const leftTeamName = matchInformations[0];
    const rightTeamName = matchInformations[1];
    const score = matchInformations[2];

    const scoreInt = score.split("-");
    const leftTeamGoals = parseInt(scoreInt[0]);
    const rightTeamGoals = parseInt(scoreInt[1]);

    const leftTeam = getTeam(leftTeamName);
    const rightTeam = getTeam(rightTeamName);

    if (leftTeam && 'goluri_date' in leftTeam) {
      leftTeam.goluri_date += leftTeamGoals;
      leftTeam.goluri_primite += rightTeamGoals;
      leftTeam.golaveraj = leftTeam.goluri_date - leftTeam.goluri_primite;
      leftTeam.meciuri_jucate++;
    }

    if (rightTeam && 'goluri_date' in rightTeam) {
      rightTeam.goluri_date += rightTeamGoals;
      rightTeam.goluri_primite += leftTeamGoals;
      rightTeam.golaveraj = rightTeam.goluri_date - rightTeam.goluri_primite;
      rightTeam.meciuri_jucate++;
    }

    const result = leftTeamGoals - rightTeamGoals;

    if (result === 0) {
      if (leftTeam && rightTeam) {
        leftTeam.egaluri++;
        rightTeam.egaluri++;
        leftTeam.punctaj++;
        rightTeam.punctaj++;
      }
    } else if (result < 0) {
      if (leftTeam && rightTeam) {
        leftTeam.infrangeri++;
        rightTeam.victorii++;
        rightTeam.punctaj += 3;
      }
    } else {
      if (leftTeam && rightTeam) {
        leftTeam.victorii++;
        rightTeam.infrangeri++;
        leftTeam.punctaj += 3;
      }
    }
  } catch (error) {
    console.error('An error occurred in updateClasament:', error.message);
  }
}

function getTeam(color) {
  if (clasament)
    for (var i = 0; i < clasament.length; i++) {
      if (clasament[i].culoare == color) {
        return clasament[i];
      }
    }
}
