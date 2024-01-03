// this method will trigger the saving of data in db

document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const data_editie = document.getElementById("data_editie").value;
  const numar_editie = document.getElementById("numar_editie").value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "data_editie": document.getElementById('data_editie').value,
    "numar_editie": document.getElementById('numar_editie').value,
  });


  var requestOptions = {
    method: 'POST',
    redirect: 'follow',
    body: raw
  };

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
        console.log('aici')
        document.getElementById('errorMessage').innerHTML = 'A fost o eroare la inregistrare.';
      }
      document.getElementById('errorMessage').style.display = 'block';
    })
    .catch(error => {
      console.log('error', error);
      document.getElementById('errorMessage').style.display = 'block';
    });

});
