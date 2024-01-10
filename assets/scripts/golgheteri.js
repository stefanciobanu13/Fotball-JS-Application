
export var marcatori = [];

export async function buildGolgheteri() {
  var table = document.getElementById("golgheteryBody");
  const players = document.querySelectorAll("li");

  players.forEach((player) => {
    if (player.textContent != "" || player.textContent != "Jucatori") {
      marcatori.push(player.textContent);
    }
  });

  // reduce the array to unique values
  const marcatoriUnici = marcatori.reduce(function (a, b) {
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

  marcatoriUnici.sort((marcator1, marcator2) => {
    const count1 = marcatori.filter((marcator) => marcator === marcator1).length;
    const count2 = marcatori.filter((marcator) => marcator === marcator2).length;
  
    const finalaCount1 = marcatoriFinalaArray.filter((marcator) => marcator === marcator1).length;
    const finalaCount2 = marcatoriFinalaArray.filter((marcator) => marcator === marcator2).length;
  
    if (count1 === count2) {
      return finalaCount1 === finalaCount2 ? 0 : finalaCount1 > finalaCount2 ? -1 : 1;
    } else {
      return count1 > count2 ? -1 : 1;
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

