// Obtener la grilla
const grid = document.querySelector('.grid');

// Generar la grilla de celdas
function generateGrid(rows, cols) {
  // Limpiar la grilla existente
  grid.innerHTML = '';

  // Función para generar una letra aleatoria
  function generateRandomLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(randomIndex);
  }

// Generar la grilla de celdas con letras personalizadas y aleatorias
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
  
      // Verificar si la celda actual debe tener una letra personalizada
      const customLetterCells = [
        { row: 2, col: 25, letter: 'B' },
        { row: 3, col: 24, letter: 'i' },
        { row: 4, col: 25, letter: 't' },
        { row: 5, col: 26, letter: 'á' },
        { row: 6, col: 27, letter: 'c' },
        { row: 7, col: 26, letter: 'o' },
        { row: 8, col: 27, letter: 'r' },
        { row: 9, col: 28, letter: 'a' },
        { row: 10, col: 27, letter: 's' },
        { row: 1, col: 12, letter: 'N' },
        { row: 2, col: 13, letter: 'o' },
        { row: 3, col: 12, letter: 'c' },
        { row: 4, col: 13, letter: 'h' },
        { row: 5, col: 14, letter: 'e' },
        { row: 4, col: 11, letter: 'D' },     
        { row: 5, col: 12, letter: 'e' },
        { row: 6, col: 13, letter: 'F' },
        { row: 7, col: 14, letter: 'a' },
        { row: 8, col: 13, letter: 'l' },
        { row: 9, col: 14, letter: 'l' },
        { row: 10, col: 15, letter: 'o' },
        { row: 11, col: 16, letter: 's' },
        { row: 11, col: 28, letter: 'L' },
        { row: 11, col: 29, letter: 'D' },
        { row: 11, col: 30, letter: 'C' },
        { row: 11, col: 31, letter: 'V' },
        // Agrega más celdas y letras personalizadas según sea necesario
      ];
  
      const customLetterCell = customLetterCells.find(
        (customCell) => customCell.row === row && customCell.col === col
      );
  
      if (customLetterCell) {
        cell.textContent = customLetterCell.letter;
      } else {
        cell.textContent = generateRandomLetter(); // Asignar una letra aleatoria como contenido
      }
  
      grid.appendChild(cell);
    }
  }
}

// Parámetros de la grilla (filas y columnas)
const rows = 12;
const cols = 40;

// Generar la grilla inicial
generateGrid(rows, cols);


// Array para almacenar las celdas seleccionadas
const selectedCells = [];

// Evento de clic en una celda
grid.addEventListener('click', function (event) {
  const clickedCell = event.target;
  if (clickedCell.classList.contains('cell')) {
    selectCell(clickedCell);
  }
});

// Función para resaltar una celda y realizar acciones adicionales
function selectCell(cell) {
  const alreadySelected = cell.classList.contains('selected');

  if (alreadySelected) {
    cell.classList.remove('selected');
    removeMidpointDot(cell);
    removeFromSelectedCells(cell);
    updateAdjacentMidpointDots();
  } else {
    cell.classList.add('selected');
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    selectedCells.push({ row, col, element: cell });

    updateAdjacentMidpointDots();
  }
}

// Función para eliminar una celda del array selectedCells
function removeFromSelectedCells(cell) {
  const index = selectedCells.findIndex((selectedCell) => selectedCell.element === cell);
  if (index !== -1) {
    selectedCells.splice(index, 1);
    
  }
}

// Función para verificar si dos celdas son adyacentes
function areCellsAdjacent(cell1, cell2) {
  const row1 = parseInt(cell1.element.dataset.row);
  const col1 = parseInt(cell1.element.dataset.col);
  const row2 = parseInt(cell2.element.dataset.row);
  const col2 = parseInt(cell2.element.dataset.col);

  const dx = Math.abs(col2 - col1);
  const dy = Math.abs(row2 - row1);

  return dx <= 1 && dy <= 1;
}

// Función para calcular el punto medio entre dos celdas
function calculateMidpoint(cell1, cell2) {
  const rect1 = cell1.getBoundingClientRect();
  const rect2 = cell2.getBoundingClientRect();

  const cell1X = rect1.left + rect1.width / 2;
  const cell1Y = rect1.top + rect1.height / 2;
  const cell2X = rect2.left + rect2.width / 2;
  const cell2Y = rect2.top + rect2.height / 2;

  return { x: (cell1X + cell2X) / 2 , y: (cell1Y + cell2Y) / 2 };
}

// Función para crear un punto medio si no existe previamente en las coordenadas dadas
function createMidpointDot(midpoint, cell1, cell2) {
  const existingDot = document.querySelector(
    '.midpoint-dot[data-x="' + midpoint.x + '"][data-y="' + midpoint.y + '"]'
  );

  if (!existingDot) {
    const dot = document.createElement('div');
    dot.classList.add('midpoint-dot');
    dot.style.left = midpoint.x + 'px';
    dot.style.top = midpoint.y + 'px';
    dot.dataset.x = midpoint.x;
    dot.dataset.y = midpoint.y;

    const dx = cell2.col - cell1.col;
    const dy = cell2.row - cell1.row;

    // Calcula el ángulo de rotación basado en la posición relativa de las celdas
    const rotation = Math.atan2(dy, dx) * (180 / Math.PI);
    console.log(rotation)
    dot.style.transform = 'translate(-50%, -50%) rotate(' + rotation + 'deg)';

    grid.appendChild(dot);
  }
}

// Función para eliminar los midpoint-dots adyacentes a una celda deseleccionada
function removeMidpointDot(cell) {
  const adjacentDots = document.querySelectorAll('.midpoint-dot');
  adjacentDots.forEach((dot) => {
    const dotX = parseFloat(dot.dataset.x);
    const dotY = parseFloat(dot.dataset.y);

    const cellRect = cell.getBoundingClientRect();
    const cellLeft = cellRect.left;
    const cellRight = cellRect.right;
    const cellTop = cellRect.top;
    const cellBottom = cellRect.bottom;

    if (
      dotX >= cellLeft - 5 &&
      dotX <= cellRight + 5 &&
      dotY >= cellTop - 5 &&
      dotY <= cellBottom + 5
    ) {
      dot.remove();
      
    }
  });
}

// Función para actualizar los midpoint-dots adyacentes al seleccionar una celda
function updateAdjacentMidpointDots() {
    const numSelectedCells = selectedCells.length;
  
    if (numSelectedCells > 1) {
      const cell1 = selectedCells[numSelectedCells - 2];
      const cell2 = selectedCells[numSelectedCells - 1];
  
      if (cell1 && cell2) {
        const areAdjacent = areCellsAdjacent(cell1, cell2);
  
        if (areAdjacent) {
          const midpoint = calculateMidpoint(cell1.element, cell2.element);
          createMidpointDot(midpoint, cell1, cell2);
        }
      }
    }
  }
  

