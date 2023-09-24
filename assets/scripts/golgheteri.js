
export var marcatori = [];

export function buildGolgheteri() {
  var table = document.getElementById("golgheteryBody");
  const players = document.querySelectorAll("li");

  players.forEach((player) => {
    if (player.textContent != "") {
      marcatori.push(player.textContent);
    }
  });

  // reduce the array to unique values
  marcatoriUnici = marcatori.reduce(function (a, b) {
    if (a.indexOf(b) < 0) a.push(b);
    return a;
  }, []);

  var marcatoriFinalaArray = [];

  const marcatoriFinala = document.querySelectorAll(".finala li");
  marcatoriFinala.forEach((marcator) => {
    if (marcator.textContent != "") {
      marcatoriFinalaArray.push(marcator.textContent);
    }
  });

  marcatoriUnici
    .sort(function (marcator1, marcator2) {
      if (
        marcatori.filter((marcator) => marcator == marcator1).length ==
        marcatori.filter((marcator) => marcator == marcator2).length
      ) {
        if (
          marcatoriFinalaArray.filter((marcator3) => marcator3 == marcator1)
            .length ==
          marcatoriFinalaArray.filter((marcator3) => marcator3 == marcator2)
            .length
        ) {
          return 0;
        } else if (
          marcatoriFinalaArray.filter((marcator3) => marcator3 == marcator1)
            .length >
          marcatoriFinalaArray.filter((marcator3) => marcator2 == marcator2)
            .length
        ) {
          return -1;
        } else {
          return 1;
        }
      } else if (
        marcatori.filter((marcator) => marcator == marcator1).length >
        marcatori.filter((marcator) => marcator == marcator2).length
      ) {
        return -1;
      } else {
        return 1;
      }
    })
    .forEach((marcator, index) => {
      var row = `<tr>
                    <td>${index + 1}</td>
                    <td>${marcator}</td>
                    <td>${
                      marcatoriFinalaArray.filter(
                        (marcator2) => marcator2 == marcator
                      ).length
                    }</td>
                    <td>${
                      marcatori.filter((marcator2) => marcator2 == marcator)
                        .length
                    }</td></td>
                </tr>`;
      table.innerHTML += row;
    }, this);
}

