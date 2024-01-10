export let url = `https://iacademy2.oracle.com/ords/footballapp/psbd/jucatori/`;

export const jucatori = {}
export const jucatori2 = []

export function getPlayers() {
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
                jucatori[player.jucator_id] = (`${player.nume} ${player.prenume}`)
                jucatori2.push(`${player.nume} ${player.prenume}`)

                if(playersList)
                    playersList.appendChild(option);
            });
        }
    };

    console.log(jucatori)
    return jucatori;
}

getPlayers();


















































