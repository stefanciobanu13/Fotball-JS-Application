import { jucatori } from "../scripts/app2.js";
import { dataPlayer } from "../scripts/script.js";

var culori = [
  {
    culoare: "portocaliu",
    id: null,
  },
  {
    culoare: "albastru",
    id: null,
  },
  {
    culoare: "verde",
    id: null,
  },
  {
    culoare: "gri",
    id: null,
  },
];

document
  .getElementById("myForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const data_editie = document.getElementById("data_editie").value;
    const numar_editie = document.getElementById("numar_editie").value;

    try {
      await fetch(
        `https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaeditie?numar_editie=${numar_editie}&data_editie=${data_editie}`,
        {
          method: "POST",
          mode: "cors",
        }
      )
        .then((result) => console.log(result))
        .catch((error) => {
          console.log("error", error);
          document.getElementById("errorMessage").style.display = "block";
        });

      await Promise.all(
        culori.map(async (culoare) => {
          const culoare_string = culoare.culoare;

          await fetch(
            `https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaechipe?culoare_echipa=${culoare_string}&numar_editie=${numar_editie}`,
            {
              method: "POST",
              redirect: "follow",
              mode: "cors",
            }
          );

          await fetch(
            `https://iacademy2.oracle.com/ords/footballapp/psbd/echipe/${culoare_string}/${numar_editie}`,
            {
              method: "GET",
              redirect: "follow",
              mode: "cors",
            }
          )
            .then((response) => response.json())
            .then((result) => (culoare.id = result.id_echipa))
            .catch((error) => console.log("error", error));

          await getPlayerTeam(culoare_string);
        })
      );

      await postMeciuri(numar_editie);

      document.getElementById("successMessage").style.display = "block";
      document.getElementById("errorMessage").style.display = "none";
    } catch (err) {
      console.log("error", err);
      document.getElementById("errorMessage").style.display = "block";
      document.getElementById("errorMessage").innerHTML = err;
      document.getElementById("successMessage").style.display = "none";
    }
  });

async function getPlayerTeam(name) {
  for (const playerInfo of dataPlayer) {
    const playerName = playerInfo[name[0].toUpperCase() + name.slice(1)];
    console.log(name[0].toUpperCase() + name.slice(1));

    if (playerName) {
      const id_culoare = culori.find((color) => color.culoare === name)?.id;
      const id = parseInt(
        Object.keys(jucatori).find(
          (playerId) => jucatori[playerId] === playerName
        )
      );

      var raw = JSON.stringify({
        jucator_id: id,
        id_echipa: id_culoare,
      });

      if (id && id_culoare) {
        fetch(
          `https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaprezenta?jucator_id=${id}&id_echipa=${id_culoare}`,
          {
            method: "POST",
            redirect: "follow",
            mode: "cors",
            body: raw,
          }
        )
          .then((response) => response.text())
          //.then(result => console.log(result))
          .catch((error) => console.log("error", error));
      }
    }
  }
}

async function postMeciuri(numar_editie) {
  const matches = document.querySelectorAll(".match");

  matches.forEach(async (match, index) => {
    const leftTeamName = match
      .querySelector(".left-team-info .team-name div")
      .textContent.trim()
      .toLowerCase();
    const rightTeamName = match
      .querySelector(".right-team-info .team-name div")
      .textContent.trim()
      .toLowerCase();

    const id_culoare_stanga = culori.find(
      (color) => color.culoare === leftTeamName.toLowerCase()
    )?.id;
    const id_culoare_dreapta = culori.find(
      (color) => color.culoare === rightTeamName.toLowerCase()
    )?.id;

    const leftTeamGoalsUlLI = match.querySelector(".left-team-info ul");
    const rightTeamGoalsUlLI = match.querySelector(".right-team-info ul");

    const leftTeamGoals = await getScorers(leftTeamGoalsUlLI);
    const rightTeamGoals = await getScorers(rightTeamGoalsUlLI);

    const leftTeamIds = await getPlayerIds(leftTeamGoals);
    const rightTeamIds = await getPlayerIds(rightTeamGoals);

    await fetch(
      `https://iacademy2.oracle.com/ords/footballapp/psbd/adauga_meci?numar_meci=${
        index + 1
      }&numar_editie=${numar_editie}`,
      {
        method: "POST",
        redirect: "follow",
        mode: "cors",
      }
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    const id_meci = await fetchData(numar_editie,index+1)

    await performFetchCalls(
      leftTeamIds,
      rightTeamIds,
      id_culoare_stanga,
      id_culoare_dreapta,
      id_meci,
      index
    );
  });

  const finale = document.querySelectorAll(".finala");

  finale.forEach(async (finala, index) => {
    const leftTeamName = finala
      .querySelector(".left-team-info .team-name div")
      .textContent.trim()
      .toLowerCase();
    const rightTeamName = finala
      .querySelector(".right-team-info .team-name div")
      .textContent.trim()
      .toLowerCase();

    const id_culoare_stanga = culori.find(
      (color) => color.culoare === leftTeamName.toLowerCase()
    )?.id;
    const id_culoare_dreapta = culori.find(
      (color) => color.culoare === rightTeamName.toLowerCase()
    )?.id;

    const leftTeamGoalsUlLI = finala.querySelector(".left-team-info ul");
    const rightTeamGoalsUlLI = finala.querySelector(".right-team-info ul");

    const leftTeamGoals = await getScorers(leftTeamGoalsUlLI);
    const rightTeamGoals = await getScorers(rightTeamGoalsUlLI);

    const leftTeamIds = await getPlayerIds(leftTeamGoals);
    const rightTeamIds = await getPlayerIds(rightTeamGoals);

    index = index + 12

    await fetch(
      `https://iacademy2.oracle.com/ords/footballapp/psbd/adauga_meci?numar_meci=${
        index + 1
      }&numar_editie=${numar_editie}`,
      {
        method: "POST",
        redirect: "follow",
        mode: "cors",
      }
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    const id_meci = await fetchData(numar_editie,index+1)

    await performFetchCalls(
      leftTeamIds,
      rightTeamIds,
      id_culoare_stanga,
      id_culoare_dreapta,
      id_meci,
      index
    );
  });

}

async function getScorers(ulElement) {
  const liElements = ulElement.querySelectorAll("li");
  const scorers = [];

  liElements.forEach((li) => {
    if (li.textContent.trim() !== "") {
      const { nume, prenume } = getNumePrenumeFromLi(li.textContent.trim());
      scorers.push({ nume, prenume });
    }
  });

  return scorers;
}

async function getPlayerIds(players) {
  const promises = players.map(({ nume, prenume }) =>
    fetchJucatorId(nume, prenume)
  );

  return Promise.all(promises);
}

async function performFetchCalls(
  leftTeamIds,
  rightTeamIds,
  id_culoare_stanga,
  id_culoare_dreapta,
  id_meci,
) {
  // Perform fetch calls using the obtained IDs
  console.log(leftTeamIds, rightTeamIds);
  leftTeamIds.forEach(async (id) => {
    if (id) {
      await fetch(
        `https://iacademy2.oracle.com/ords/footballapp/psbd/adauga_gol?echipa_id=${id_culoare_stanga}&meci_id=${
          id_meci
        }&jucator_id=${id}`,
        {
          method: "POST",
          redirect: "follow",
          mode: "cors",
        }
      );
    }
  });

  rightTeamIds.forEach(async (id) => {
    if (id) {
      await fetch(
        `https://iacademy2.oracle.com/ords/footballapp/psbd/adauga_gol?echipa_id=${id_culoare_dreapta}&meci_id=${
          id_meci
        }&jucator_id=${id}`,
        {
          method: "POST",
          redirect: "follow",
          mode: "cors",
        }
      );
    }
  });
}
function getNumePrenumeFromLi(scorerText) {
  // Logic to parse the text and extract 'nume' and 'prenume' here
  // Return an object like { nume: '...', prenume: '...' }
  // Example:
  const [nume, prenume] = scorerText.split(" "); // Split the text to get 'nume' and 'prenume'
  return { nume, prenume };
}

async function fetchJucatorId(nume, prenume) {
  try {
    const response = await fetch(
      `https://iacademy2.oracle.com/ords/footballapp/psbd/jucator/${nume}/${prenume}`,
      {
        method: "GET",
        redirect: "follow",
        mode: "cors",
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.jucator_id;
    } else {
      throw new Error("Failed to fetch");
    }
  } catch (error) {
    console.error("Error fetching jucator_id:", error);
    return null;
  }
}

async function fetchData(numar_editie, index) {
  try {
    const response = await fetch(
      `https:iacademy2.oracle.com/ords/footballapp/psbd/meci/${numar_editie}/${index}`,
      {
        method: "GET",
        redirect: "follow",
        mode: "cors",
      }
    );

    const result = await response.text();
    console.log(result); // Log the result

    // Parse the JSON if the response is JSON, then access id_meci
    const parsedResult = JSON.parse(result);
    const id_meci = parsedResult.id_meci;

    return id_meci; // Return the id_meci value
  } catch (error) {
    console.log("error", error);
    throw error; // Throw the error to handle it outside this function if needed
  }
}
