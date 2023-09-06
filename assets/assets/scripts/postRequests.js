import { clasament } from "./script.js";
import { saveTheForm } from "./app2.js";
import { dataPlayer } from "./script.js";
import { countNonNullLi } from "./script.js";

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
          postTeams();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export async function saveTeam(color) {

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

async function getTeamsFromDb() {
  try {
    const response = await fetch(`${url}teams/roundNumber/${theRoundId}`);
    const data = await response.json();
    console.log(`inside getTeamFromDB ${data}`);
  } catch (error) {
    console.error('Error:', error);
  }
}


async function assignTeamsId(color) {
  let theTeamId;
  let theTeamColor;
  axios.get(`http://localhost:8083/teams/fromRound?roundId=${theRoundId}&color=${color}`)
    .then(response => {
      // Handle the response here
      console.log('Response of getTeamFromRound:', response.data);
      theTeamId = response.data.id;
      theTeamColor = response.data.color;
      switch (color) {
        case "Portocaliu":
          teamOrangeId = theTeamId;
          //    console.log(`the id of TeamOrange is ${teamOrangeId}`)
          break;
        case "Verde":
          teamGreenId = theTeamId;
          //    console.log(`the id of TeamGreen is ${teamGreenId}`)
          break;
        case "Albastru":
          teamBlueId = theTeamId;
          //  console.log(`the id of TeamBlue is ${teamBlueId}`)
          break;
        case "Gri":
          teamGrayId = theTeamId;
          //   console.log(`the id of TeamGray is ${teamGrayId}`)
          break;
      }
    })
    .catch(error => {
      // Handle errors here
      console.error('Error:', error);
      assignTeamsId(color);
    });
}

export async function postTeams() {
  const green = "Verde";
  const orange = "Portocaliu";
  const blue = "Albastru";
  const gray = "Gri";
  await saveTeam(orange);
  await saveTeam(green);
  await saveTeam(blue);
  await saveTeam(gray);
  await assignTeamsId(orange);
  await assignTeamsId(green);
  await assignTeamsId(gray);
  await assignTeamsId(blue);
  await assignPlayerId();
  storeGame()
}

function extractNames(fullName) {
  const parts = fullName.split(/(?=[A-Z])/); // Split on uppercase letters
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return {
    firstName: firstName,
    lastName: lastName
  };
}


async function assignPlayerId() {
  dataPlayer.forEach(async playerMap => {
    const portocaliuName = playerMap['Portocaliu'];
    console.log(`the name of the player orange is ${portocaliuName}`)
    const verdeName = playerMap['Verde'];
    console.log(`the name of the player green is ${verdeName}`)
    const albastruName = playerMap['Albastru'];
    console.log(`the name of the player blue is ${albastruName}`)
    const griName = playerMap['Gri'];
    console.log(`the name of the player grey is ${griName}`)

    if (portocaliuName) {
      const names = extractNames(portocaliuName);
      const color = "Portocaliu";
      await getPlayerAndPost(names, color);
    }
    if (verdeName) {
      const names = extractNames(verdeName);
      const color = "Verde";
      await getPlayerAndPost(names, color);
    }
    if (albastruName) {
      const names = extractNames(albastruName);
      const color = "Albastru";
      await getPlayerAndPost(names, color);
    }
    if (griName) {
      const names = extractNames(griName);
      const color = "Gri";
      await getPlayerAndPost(names, color);
    }
  })

};


async function getPlayerAndPost(names, color) {
  try {
    const response = await axios.get(`http://localhost:8083/players/name/?firstName=${names.firstName}&lastName=${names.lastName}`);
    // console.log(`${response}`);
    const playerId = response.data.id;
    // console.log(`ID of the player is: ${playerId}`);
    postTeamPlayer(playerId, color);
  } catch (error) {
    console.error('Error:', error);
  }
}


async function findThePlayerInDb(firstName, lastName) {
  axios.get(`http://localhost:8083/players/name/?firstName=${firstName}&lastName=${lastName}`).then(response => {
    console.log(`inside the findThePlayerInDb and the player id is ${response.data.id}`)
  })
}

async function postTeamPlayer(thePlayerId, color) {
  let theTeamId;
  switch (color) {
    case "Portocaliu": theTeamId = teamOrangeId;
      //  console.log(`inside switch case 1, team id is ${theTeamId}`)
      break;
    case "Verde": theTeamId = teamGreenId;
      //  console.log(`inside switch case 2, team id is ${theTeamId}`)
      break;
    case "Albastru": theTeamId = teamBlueId;
      //  console.log(`inside switch case 3, team id is ${theTeamId}`)
      break;
    case "Gri": theTeamId = teamGrayId;
      //  console.log(`inside switch case 4, team id is ${theTeamId}`)
      break;
  }
  //console.log(`inside postTeamPlayer and the id is ${theTeamId} on color ${color}`)
  const teamPlayer = {
    teamId: theTeamId,
    playerId: thePlayerId
  }
  // console.log(`ID of team Orange is= ${teamOrangeId}`);
  // console.log(`ID of team Green is= ${teamGreenId}`);
  // console.log(`ID of team Blue is= ${teamBlueId}`);
  // console.log(`ID of team Gray is= ${teamGrayId}`);

  //console.log(`before saving team-player, teamId is: ${theTeamId} and playerId is: ${thePlayerId}`)
  axios.post(`${url}team-players`, teamPlayer).then(response => {
  })
    .catch(error => {
      // Handle errors here
      postTeamPlayer(thePlayerId, color)
      console.error('Error:', error);
    });
}


export const postGame = function postGame() {
  const games = document.getElementsByClassName('match');
  const gamesArray = Array.from(games);
  gamesArray.forEach(element => {
    storeGame(element.id);
  })


}

async function storeGame() {

  const match = document.querySelectorAll('.match');
  let leftTeamName;
  let rightTeamName;
  let gameNumber;
  match.forEach(async matches => {
    const leftTeamGoalsUl = matches.querySelector('.left-team-info ul');
    const rightTeamGoalsUl = matches.querySelector('.right-team-info ul');
    leftTeamName = matches.querySelector('.left-team-info .team-name').children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
    rightTeamName = matches.querySelector('.right-team-info .team-name').children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
    const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
    const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);
    gameNumber = matches.id.slice(5);
    console.log(`Match info: nr game = ${gameNumber}, leftTeamName = ${leftTeamName},rightTeamName= ${rightTeamName},leftTeamScore = ${leftTeamGoalsCount}, rightTeamScore = ${rightTeamGoalsCount}`)

    await saveTheGame(gameNumber, leftTeamGoalsCount, rightTeamGoalsCount, leftTeamName, rightTeamName);

  }, this);


  const fmLeftTeamName = document.querySelector('#finala-mica .left-team-info .team-name').children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  const fmRightTeamName = document.querySelector('#finala-mica .right-team-info .team-name').children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  const fMLeftTeamName = document.querySelector('#finala-mare .left-team-info .team-name').children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  const fMRightTeamName = document.querySelector('#finala-mare .right-team-info .team-name').children[0].textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
  const numberFm = 13;
  const numberFM = 14;

  const leftTeamFmScore = countNonNullLi(document.querySelector('#finala-mica .left-team-info ul'));
  const rightTeamFmScore = countNonNullLi(document.querySelector('#finala-mica .right-team-info ul'));
  const leftTeamFMScore = countNonNullLi(document.querySelector('#finala-mare .left-team-info ul'));
  const rightTeamFMScore = countNonNullLi(document.querySelector('#finala-mare .right-team-info ul'));

  console.log(`the info of SMALL final: team1Name = ${fmLeftTeamName}, team2Name = ${fmRightTeamName}, gameNumber= ${numberFm}, scoreT1 = ${leftTeamFmScore}, scoreT2= ${rightTeamFmScore} `);
  console.log(`the info of BIG final: team1Name = ${fMLeftTeamName}, team2Name = ${fMRightTeamName}, gameNumber= ${numberFM}, scoreT1 = ${leftTeamFMScore}, scoreT2= ${rightTeamFMScore} `);

  saveTheGame(numberFm, leftTeamFmScore, rightTeamFmScore, fmLeftTeamName, fmRightTeamName);
  saveTheGame(numberFM, leftTeamFMScore, rightTeamFMScore, fMLeftTeamName, fMRightTeamName);

}

function saveSmallFinal(gameNumber, team1Score, team2Score, leftTeamName, rightTeamName) {

}

function saveBigFinal(gameNumber, team1Score, team2Score, leftTeamName, rightTeamName) {

}

async function saveTheGame(gameNumber, team1Score, team2Score, leftTeamName, rightTeamName) {
  console.log(`Inside the saveGameMethod: gameNr = ${gameNumber}, team1Score = ${team1Score},team2Score= ${team2Score},leftTeamName = ${leftTeamName}, rightTeamName = ${rightTeamName}`);
  let team1Id;
  let team2Id;

  switch (leftTeamName) {
    case "Portocaliu": team1Id = teamOrangeId;
      console.log("inside first switch case  1")
      console.log(`the ID OF ORANGE IS ${teamOrangeId}`)
      console.log(`the ID OF GREEN IS ${teamGreenId}`)
      console.log(`the ID OF BLUE IS ${teamBlueId}`)
      console.log(`the ID OF GRAY IS ${teamGrayId}`)
      break;
    case "Verde": team1Id = teamGreenId;
      console.log("inside first switch case  2")
      console.log(`the ID OF ORANGE IS ${teamOrangeId}`)
      console.log(`the ID OF GREEN IS ${teamGreenId}`)
      console.log(`the ID OF BLUE IS ${teamBlueId}`)
      console.log(`the ID OF GRAY IS ${teamGrayId}`)
      break;
    case "Albastru": team1Id = teamBlueId;
      console.log("inside first switch case  3")
      break;
    case "Gri": team1Id = teamGrayId;
      console.log("inside first switch case  4")
      break;
  }
  switch (rightTeamName) {
    case "Portocaliu": team2Id = teamOrangeId;
      break;
    case "Verde": team2Id = teamGreenId;
      break;
    case "Albastru": team2Id = teamBlueId;
      break;
    case "Gri": team2Id = teamGrayId;
      break;
  }

  const postData = {
    team1Id: team1Id,
    team2Id: team2Id,
    roundId: theRoundId,
    team1Goals: team1Score,
    team2Goals: team2Score,
    number: gameNumber
  }
  console.log(`post data object ${postData.team1Goals} ${postData.team2Goals}, team1Id= ${postData.team1Id},team2Id =${postData.team2Id}, roundId= ${postData.roundId}, number= ${postData.number} `);

  axios.post(`${url}games`, postData).then(response => {
    console.log(`GAME number ${gameNumber} was saved with t1 score= ${postData.team1Goals} and t2score = ${postData.team2Goals}`)
  }).catch(error => {
    saveTheGame(gameNumber, team1Score, team2Score, leftTeamName, rightTeamName);
    console.error('Error:', error);
  });
}

export const postGoal = function postGoal() {


}