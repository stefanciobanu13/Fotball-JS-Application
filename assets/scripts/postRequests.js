import { clasament } from "./script.js";

const url = "http://localhost:8083/"
let roundNumber;
let theRoundId;
let teamOrangeId;
let teamGreenId;
let teamBlueId;
let teamGrayId;


function convertDateFormat(inputDate) {
  //convert the data format 
  const parts = inputDate.split('-');
  if (parts.length !== 3) {
    throw new Error('Invalid date format');
  }
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
}

export const postRound = function postRound() {
  // this method will trigger the saving of data in db
  const roundDate = document.getElementById("data_editie").value;
  const formatedDate = convertDateFormat(roundDate);
  roundNumber = document.getElementById("numar_editie").value;
  const postData = {
    date: formatedDate,
    number: roundNumber,
  };
  axios.post(`${url}rounds`, postData)
    .then(response => {
      console.log('Response:', response.data);
      // get back the round
      axios.get(`${url}rounds/number/${roundNumber}`)
        .then(response => {
          theRoundId = response.data.id;
          console.log('Response:', response.data);
        }).then(() => {
          postTeam();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export function saveTeam(color) {
  const teamColor = color;
  let teamPoints;
  let teamGoalRate;
  clasament.forEach(element => {
    if (element.culoare === color) {
      teamPoints = element.punctaj;
      teamGoalRate = element.golaveraj;
    }
  })
  //save the team 
  const postData = {
    color: teamColor,
    points: teamPoints,
    goalRate: teamGoalRate,
    roundId: theRoundId,
  }
  axios.post(`${url}teams`, postData)
    .catch(error => {
      console.error('Error:', error);
    });
}

function assignTeamsId() {
  const green = "Verde";
  const orange = "Portocaliu";
  const blue = "Albastru";
  const gray = "Gri"

  axios.get(`${url}teams/roundNumber/${roundNumber}`).then(response => {
    console.log(response.data);
  })
    .catch(error => {
      console.error('Error:', error);
    });

}


export const postTeam = function postTeams() {
  const green = "Verde";
  const orange = "Portocaliu";
  const blue = "Albastru";
  const gray = "Gri"
  saveTeam(orange);
  saveTeam(green);
  saveTeam(blue);
  saveTeam(gray);
  assignTeamsId();
}


export const postTeamPlayer = function postTeamPlayer() {


}

export const postGame = function postGame() {


}

export const postGoal = function postGoal() {


}


























