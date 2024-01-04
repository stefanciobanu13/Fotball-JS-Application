import { url } from "./app2.js";
import { dataPlayer } from "./script.js";

var requestOptions = {
  method: 'POST',
  redirect: 'follow',
};


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

// this method will trigger the saving of data in db
document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const data_editie = document.getElementById("data_editie").value;
  const numar_editie = document.getElementById("numar_editie").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");



  fetch(`https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaeditie?numar_editie=${numar_editie}&data_editie=${data_editie}`, requestOptions)
    .then(response => {
      if (response.ok) {
        document.getElementById('successMessage').style.display = 'block';
      }
      else if (!response.ok) {
        return response.json();  // parse the error message
      }
    })

    .then(data => {
      if (data && data.cause.includes('ORA-00001')) {
        // Display a specific error message if the edition already exists
        document.getElementById('errorMessage').innerHTML = 'Editia exista deja in baza de date.';
      } else {
        document.getElementById('errorMessage').innerHTML = 'A fost o eroare la inregistrare.';
      }


      culori.forEach(culoare => {
        var culoare_string = culoare.culoare;




        fetch(`https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaechipe?culoare_echipa=${culoare_string}&numar_editie=${numar_editie}`, requestOptions)
          .then(response => {
            if (response.ok) {
            }
            else if (!response.ok) {
              return response.json();  // parse the error message
            }
          })
        var requestOptionsGET = {
          method: 'GET',
          redirect: 'follow'
        };

        fetch(`https://iacademy2.oracle.com/ords/footballapp/psbd/echipe/${culoare_string}/${numar_editie}`, requestOptionsGET)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      });


    })
    .catch(error => {
      console.log('error', error);
      document.getElementById('errorMessage').style.display = 'block';
    });

  var xhttp = new XMLHttpRequest();

  xhttp.open("GET", url, true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.response).items;

      response.forEach(player => {
        //jucatori.push(`${player.nume} ${player.prenume}${player.jucator_id}`)
        getPlayerTeam(`${player.nume} ${player.prenume}`, player.jucator_id)
      });
    }
  };

});

function getPlayerTeam(name, id) {
  for (var i = 0; i < dataPlayer.length; i++) {
    var playerInfo = dataPlayer[i];
    for (var culoare in playerInfo) {
      if (playerInfo[culoare] === name) {
        //console.log(`Jucatorul ${playerInfo[culoare]} ( ${id} )  joaca la ${culoare}`)
        culoare = culoare.toLowerCase();

        var id_culoare;

        for (var color in culori) {
          if (color === culoare) {
            id_culoare = color.id;
          }
        }

        fetch(`https://iacademy2.oracle.com/ords/footballapp/psbd/adaugaprezenta?jucator_id=${id}&id_echipa=${id_culoare}`, requestOptions)
          .then(response => response.text())
        //.then(result => console.log(result))
        //.catch(error => console.log('error', error));
      }
    }
  }

}