import { jucatori } from "../scripts/app2.js";
import {dataPlayer} from "../scripts/script.js"

var culori = [
  {
    culoare: "portocaliu",
    id: null
  },
  {
    culoare: "albastru",
    id: null
  },
  {
    culoare: "verde",
    id: null
  },
  {
    culoare: "gri",
    id: null
  }
]

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
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

      // nu prea vad ce sens are chestia asta cezar, indiferent de ce zice acest `if`
      // oricum o sa ai o eroare
      // if (data && data.cause.includes("ORA-00001")) {
      //   // Display a specific error message if the edition already exists
      //   throw "Editia exista deja in baza de date.";
      // } else {
      //   throw "A fost o eroare la inregistrare.";
      // }

      await Promise.all(
        culori.map(async (culoare) => {
          const culoare_string = culoare.culoare;

          await fetch(
            `https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaechipe?culoare_echipa=${culoare_string}&numar_editie=${numar_editie}`,
            {
              method: 'POST',
              redirect: 'follow',
              mode: "cors"
            }
          );

          await fetch(
            `https://iacademy2.oracle.com/ords/footballapp/psbd/echipe/${culoare_string}/${numar_editie}`,
            {
              method: "GET",
              redirect: "follow",
              mode:"cors"
            }
          )
            .then((response) => response.json())
            .then((result) =>  culoare.id = result.id_echipa)
            .catch((error) => console.log("error", error));

            getPlayerTeam(culoare_string)
        }),
        );

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
    console.log(name[0].toUpperCase() + name.slice(1))
    
    if (playerName) {
      const id_culoare = culori.find(color => color.culoare === name)?.id;
  
      const id = Object.keys(jucatori).find(playerId => jucatori[playerId] === playerName);
      
      //console.log(id,id_culoare)

      var raw = JSON.stringify({
        "jucator_id": id,
        "id_echipa": id_culoare
     });

      if (id && id_culoare) {
        fetch(`https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaprezenta?jucator_id=${id}&id_echipa=${id_culoare}}`, {
          method: "POST",
          redirect: "follow",
          mode: "cors",
          body: raw,
        })
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      }
    }
  }
}