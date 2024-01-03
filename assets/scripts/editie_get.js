
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
        var editionData = JSON.parse(this.response);
        displayEditionDetails(editionData);
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

