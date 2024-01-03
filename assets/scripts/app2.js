
const selectPlayerBtn = document.getElementById("button_selectPlayer");

let url = `https://iacademy2.oracle.com/ords/footballapp/psbd/jucatori/`;

export const jucatori = []

function getPlayers() {
    //get the players and populate the drop down list of players
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.response).items;

            const playersList = document.getElementById("playersList");
            response.forEach(player => {

                const option = document.createElement('option');
                option.value = `${player.nume} ${player.prenume}`;
                jucatori.push(`${player.nume} ${player.prenume}`)
                playersList.appendChild(option);
            });
        }
    };

    return playersList;
}

getPlayers();


















































