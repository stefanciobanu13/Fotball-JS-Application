
// Get the edition number from the URL
const urlParams = new URLSearchParams(window.location.search);
const numar_editie = urlParams.get('id');

// Load edition information using the edition number
var xhttp = new XMLHttpRequest();
let url = `https://iacademy2.oracle.com/ords/footballapp/psbd/editii/${numar_editie}`;
xhttp.open("GET", url, true);
xhttp.send();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var result = JSON.parse(this.response);
        console.log(result)
        // Mapping of colors to class names for table cells
        const playerData = result.items;

        displayEditionDetails(playerData[0]);

        var colorClasses = {
            "Portocaliu": "orange",
            "Verde": "green",
            "Albastru": "blue",
            "Gri": "grey"
        };

        // Get the table element
        var table = document.getElementById("teams");
                

        // Initialize columns array
        var columns = {};
        Object.keys(colorClasses).forEach(function(color) {
            columns[color] = [];
        });

        // Loop through the players and populate the columns
        playerData.forEach(function(player) {
            columns[player.culoare_echipa].push(player.nume_jucator);
        });

        // Find the maximum length among columns
        var maxLength = Math.max(...Object.values(columns).map(arr => arr.length));

        // Populate the table using columns
        for (var i = 0; i < maxLength; i++) {
            var row = table.insertRow(-1);
            Object.keys(columns).forEach(function(color) {
                var cell = row.insertCell(-1);
                cell.textContent = columns[color][i] || "";
                cell.className = colorClasses[color];
            });
        }
        }
        
    
};

// Function to display the edition details
function displayEditionDetails(edition) {
    var date_picker = document.getElementById("data_editie");
    date_picker.value = edition.data_editie;
    date_picker.disabled = true;

    var nr_editie = document.getElementById("numar_editie");
    nr_editie.value = edition.numar_editie;
    nr_editie.disabled = true;

    

    console.log( edition.data_editie, edition.numar_editie)
}

