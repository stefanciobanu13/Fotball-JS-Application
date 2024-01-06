
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
        console.log(result.items)
        // Mapping of colors to class names for table cells

        const playerData = result.items;

        var colorClasses = {
            "Portocaliu": "orange",
            "Verde": "green",
            "Albastru": "blue",
            "Gri": "grey"
        };
        
        // Get the table element
        var table = document.getElementById("teams");
        
        // Loop through the players and populate the table based on team colors
        for (var i = 0; i < Math.ceil(playerData.length / 4); i++) {
            var row = table.insertRow(-1); // Insert a new row at the end
          
            for (var j = i * 4; j < (i + 1) * 4 && j < playerData.length; j++) {
              var player = playerData[j];
              var td = row.insertCell(-1);
          
              if ((j + 1) % 4 === 0) {
                td.className = colorClasses["Portocaliu"];
              } else if ((j + 1) % 4 === 1) {
                td.className = colorClasses["Verde"];
              } else if ((j + 1) % 4 === 2) {
                td.className = colorClasses["Albastru"];
              } else {
                td.className = colorClasses["Gri"];
              }
              
              td.textContent = player.nume_jucator;
            }
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

