import { dataPlayer } from "./script.js";
import { countNonNullLi } from "./helpers.js";


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
  await storeGame()
  await postGoals();
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
    const verdeName = playerMap['Verde'];
    const albastruName = playerMap['Albastru'];
    const griName = playerMap['Gri'];

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
    storeGame();
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

    await saveTheGame(gameNumber, leftTeamGoalsCount, rightTeamGoalsCount, leftTeamName, rightTeamName);
    //get back the id of the game


  }, this);
  //define the data of the finals
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

  //console.log(`the info of SMALL final: team1Name = ${fmLeftTeamName}, team2Name = ${fmRightTeamName}, gameNumber= ${numberFm}, scoreT1 = ${leftTeamFmScore}, scoreT2= ${rightTeamFmScore} `);
  //console.log(`the info of BIG final: team1Name = ${fMLeftTeamName}, team2Name = ${fMRightTeamName}, gameNumber= ${numberFM}, scoreT1 = ${leftTeamFMScore}, scoreT2= ${rightTeamFMScore} `);

  saveTheGame(numberFm, leftTeamFmScore, rightTeamFmScore, fmLeftTeamName, fmRightTeamName);
  saveTheGame(numberFM, leftTeamFMScore, rightTeamFMScore, fMLeftTeamName, fMRightTeamName);

}

async function saveTheGame(gameNumber, team1Score, team2Score, leftTeamName, rightTeamName) {
  //  console.log(`Inside the saveGameMethod: gameNr = ${gameNumber}, team1Score = ${team1Score},team2Score= ${team2Score},leftTeamName = ${leftTeamName}, rightTeamName = ${rightTeamName}`);
  let team1Id;
  let team2Id;

  switch (leftTeamName) {
    case "Portocaliu": team1Id = teamOrangeId;
      // console.log("inside first switch case  1")
      // console.log(`the ID OF ORANGE IS ${teamOrangeId}`)
      // console.log(`the ID OF GREEN IS ${teamGreenId}`)
      // console.log(`the ID OF BLUE IS ${teamBlueId}`)
      // console.log(`the ID OF GRAY IS ${teamGrayId}`)
      break;
    case "Verde": team1Id = teamGreenId;
      // console.log("inside first switch case  2")
      // console.log(`the ID OF ORANGE IS ${teamOrangeId}`)
      // console.log(`the ID OF GREEN IS ${teamGreenId}`)
      // console.log(`the ID OF BLUE IS ${teamBlueId}`)
      // console.log(`the ID OF GRAY IS ${teamGrayId}`)
      break;
    case "Albastru": team1Id = teamBlueId;
      //  console.log("inside first switch case  3")
      break;
    case "Gri": team1Id = teamGrayId;
      // console.log("inside first switch case  4")
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
  // console.log(`post data object ${postData.team1Goals} ${postData.team2Goals}, team1Id= ${postData.team1Id},team2Id =${postData.team2Id}, roundId= ${postData.roundId}, number= ${postData.number} `);

  axios.post(`${url}games`, postData).then(response => {
    // console.log(`GAME number ${gameNumber} was saved with t1 score= ${postData.team1Goals} and t2score = ${postData.team2Goals}`)
  }).catch(error => {
    saveTheGame(gameNumber, team1Score, team2Score, leftTeamName, rightTeamName);
    console.error('Error:', error);
  });
}

export async function postGoals() {
  const matches = document.querySelectorAll('.match');
  matches.forEach(async match => {
    await processMatch(match);
  });
  const sfNr = 13;
  const bfNr = 14;
  const smallF = "mica";
  const bigF = "mare"
  processFinals(sfNr, smallF);
  processFinals(bfNr, bigF);
}

//this is a method to save the goals from the finals
async function processFinals(gameNumber, type) {
  try {
    const game = await getGameByNumberAndRound(gameNumber, theRoundId);
    const gameId = game.id;
    const match = document.getElementById(`finala-${type}`);
    const leftScorersUl = match.querySelector('.left-team-info ul');
    const rightScorersUl = match.querySelector('.right-team-info ul');
    const leftScorers = leftScorersUl.querySelectorAll('li');
    const rightScorers = rightScorersUl.querySelectorAll('li');
    await processScorers(leftScorers, gameId);
    await processScorers(rightScorers, gameId);
  } catch (error) {
    processFinals(gameNumber, type);
    console.error(`Error processing match with game number ${gameNumber}: ${error}`);
  }
}

async function processMatch(match) {
  const gameNumber = match.id.slice(5);
  // console.log(`Processing match with game number ${gameNumber}`);

  try {
    const game = await getGameByNumberAndRound(gameNumber, theRoundId);
    const gameId = game.id;
    //  console.log(`Found game with ID ${gameId}`);

    const leftScorersUl = match.querySelector('.left-team-info ul');
    const rightScorersUl = match.querySelector('.right-team-info ul');
    const leftScorers = leftScorersUl.querySelectorAll('li');
    const rightScorers = rightScorersUl.querySelectorAll('li');

    await processScorers(leftScorers, gameId);
    await processScorers(rightScorers, gameId);
  } catch (error) {
    processMatch(match);
    console.error(`Error processing match with game number ${gameNumber}: ${error}`);
  }
}

async function getGameByNumberAndRound(gameNumber, roundId) {
  try {
    const response = await axios.get(`http://localhost:8083/games/byNumberAndRound?gameNumber=${gameNumber}&roundId=${roundId}`);
    return response.data;
  } catch (error) {
    getGameByNumberAndRound(gameNumber, roundId);
    throw new Error(`Error fetching game data: ${error}`);
  }
}

async function processScorers(scorers, gameId) {
  for (const scorer of scorers) {
    const scorerText = scorer.textContent.trim();
    if (scorerText !== '') {
      const playerFullName = extractNames(scorerText);
      const playerId = await findPlayerId(playerFullName.firstName, playerFullName.lastName);
      console.log(`Scorer: ${playerFullName.firstName} ${playerFullName.lastName}, Player ID: ${playerId}`);
      await saveGoal(playerId, gameId);
    }
  }
}

async function findPlayerId(firstName, lastName) {
  try {
    const response = await axios.get(`http://localhost:8083/players/name/?firstName=${firstName}&lastName=${lastName}`);
    return response.data.id;
  } catch (error) {
    findPlayerId(firstName, lastName);
    console.error(`Error fetching player data: ${error}`);
    return null;
  }
}

async function saveGoal(playerId, gameId) {
  try {
    const postData = {
      playerId: playerId,
      gameId: gameId
    };
    await axios.post(`http://localhost:8083/goals`, postData);
    // console.log(`Goal saved for Player ID: ${playerId}, Game ID: ${gameId}`);
  } catch (error) {
    saveGoal(playerId, gameId);
    console.error(`Error saving goal: ${error}`);
  }
}

























































