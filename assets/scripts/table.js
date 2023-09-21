export const table = document.getElementById("teams");

export function populateTable(value) {
  const table = document.getElementById("teams");
  const emptyPosition = findFirstEmptyPosition();

  if (emptyPosition) {
    const { row, column } = emptyPosition;
    const cell = table.rows[row].cells[column];

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt", "delete-button");

    cell.innerHTML = "";
    cell.textContent = value;
    cell.appendChild(deleteIcon);
  }
}

export const submitButton = document.getElementById("button_selectPlayer");
submitButton.addEventListener("click", function () {
  const input = document.getElementById("input_selectPlayer");
  const selectedValue = input.value;
  populateTable(selectedValue);
});

export function checkTableContent() {
  const table = document.getElementById("teams");
  const rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      const cellContent = cells[j].innerText.trim();
      if (cellContent === "") {
        return false;
      }
    }
  }
  return true;
}

export function findFirstEmptyPosition() {
  const table = document.getElementById("teams");
  const rows = table.getElementsByTagName("tr");

  for (let j = 0; j < rows[0].cells.length; j++) {
    for (let i = 0; i < rows.length; i++) {
      const cellContent = rows[i].cells[j].innerText.trim();
      if (cellContent === "") {
        return { row: i, column: j };
      }
    }
  }

  return null;
}
