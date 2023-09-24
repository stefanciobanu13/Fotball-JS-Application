export function countNonNullLi(ulElement) {
  const liElements = ulElement.querySelectorAll("li");
  let count = 0;

  liElements.forEach((li) => {
    if (li.textContent.trim() !== "") {
      count++;
    }
  });

  return count;
}

export function getMatchInformations(match) {
  const leftTeamName = match.children[0].children[0].children[0].textContent.trim();
  const rightTeamName = match.children[0].children[2].children[0].textContent.trim();
  const score = match.children[0].children[1].textContent;

  return [leftTeamName, rightTeamName, score];
}

export function removeValue(cell) {
  // Remove the value from the table cell
  cell.innerHTML = "";
}

export function removeDeleteButtons() {
  const table = document.getElementById("teams");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      const deleteButton = cells[j].querySelector(".delete-button");
      if (deleteButton) {
        deleteButton.remove();
      }
    }
  }
}
