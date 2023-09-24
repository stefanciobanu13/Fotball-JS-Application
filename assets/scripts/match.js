import { countNonNullLi, getMatchInformations } from "./helpers.js";
import { updateClasament, clasamentSelectiv } from "./clasament.js";

export const matches = document.querySelectorAll(".match");
matches.forEach((match) => {
  const leftTeamGoalsUl = match.querySelector(".left-team-info ul");
  const rightTeamGoalsUl = match.querySelector(".right-team-info ul");

  const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
  const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

  const scoreElement = match.querySelector(".scor");
  scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;
  updateClasament(match);
}, this);

// this function get better team from tur and retur
export function getBetterTeamByDirectMatch(team1, team2) {
  let leftTeamName, rightTeamName;

  const matches = document.querySelectorAll(".match");
  matches.forEach((match) => {
    const matchInformations = getMatchInformations(match);
    leftTeamName = matchInformations[0];
    rightTeamName = matchInformations[1];
    const score = matchInformations[2];

    const scoreInt = score.split("-");
    const leftTeamGoals = parseInt(scoreInt[0]);
    const rightTeamGoals = parseInt(scoreInt[1]);

    const leftTeam = clasamentSelectiv.find(
      (team) => team.culoare === leftTeamName
    );
    const rightTeam = clasamentSelectiv.find(
      (team) => team.culoare === rightTeamName
    );

    if (leftTeam && rightTeam) {
      leftTeam[`vs_${rightTeamName}`] += leftTeamGoals - rightTeamGoals;
      rightTeam[`vs_${leftTeamName}`] += rightTeamGoals - leftTeamGoals;
    }
  }, this);

  const leftTeam = clasamentSelectiv.find(
    (team) => team.culoare === leftTeamName
  );
  const rightTeam = clasamentSelectiv.find(
    (team) => team.culoare === rightTeamName
  );

  if (leftTeam && rightTeam) {
    if (leftTeam[`vs_${rightTeamName}`] > rightTeam[`vs_${leftTeamName}`]) {
      return -1;
    } else if (
      leftTeam[`vs_${rightTeamName}`] < rightTeam[`vs_${leftTeamName}`]
    ) {
      return 1;
    } else {
      return 0;
    }
  }
}
