const prompt = require("prompt-sync")({ sigint: true });

const LENGTH = 4;
const WINNING_SCORE = 2048;
let highest = 0;

const table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const printTable = () => {
  let rowStr;
  table.forEach((row) => {
    rowStr = "";
    row.forEach((item) => {
      rowStr = `                       ${rowStr}   ${item}     |   `;
    });
    console.log(`${rowStr}\n`);
  });
};

const move = (index, direction) => {
  let isMoveValid = false;
  if (direction == "up") {
    let j = index;
    for (let i = 0; i < LENGTH - 1; i++) {
      if (table[i][j] == 0) {
        for (let k = i + 1; k < LENGTH; k++) {
          if (table[k][j] !== 0) {
            table[i][j] = table[k][j];
            table[k][j] = 0;
            isMoveValid = true;
            break;
          }
        }
      }
    }
  } else if (direction == "down") {
    let j = index;
    for (let i = LENGTH - 1; i >= 1; i--) {
      if (table[i][j] == 0) {
        for (let k = i - 1; k >= 0; k--) {
          if (table[k][j] !== 0) {
            table[i][j] = table[k][j];
            table[k][j] = 0;
            isMoveValid = true;
            break;
          }
        }
      }
    }
  } else if (direction == "left") {
    let i = index;
    for (let j = 0; j < LENGTH - 1; j++) {
      if (table[i][j] == 0) {
        for (let k = j + 1; k < LENGTH; k++) {
          if (table[i][k] !== 0) {
            table[i][j] = table[i][k];
            table[i][k] = 0;
            isMoveValid = true;
            break;
          }
        }
      }
    }
  } else if (direction == "right") {
    let i = index;
    for (let j = LENGTH - 1; j >= 1; j--) {
      if (table[i][j] == 0) {
        for (let k = j - 1; k >= 0; k--) {
          if (table[i][k] !== 0) {
            table[i][j] = table[i][k];
            table[i][k] = 0;
            isMoveValid = true;
            break;
          }
        }
      }
    }
  }
  return isMoveValid;
};

const unite = (index, direction) => {
  let didUnite = false;
  if (direction == "up") {
    let j = index;
    for (let i = 0; i < LENGTH - 1; i++) {
      if (table[i][j] !== 0 && table[i + 1][j] == table[i][j]) {
        table[i][j] = table[i][j] * 2;
        if (table[i][j] > highest) {
          highest = table[i][j];
        }
        table[i + 1][j] = 0;
        didUnite = true;
      }
    }
  } else if (direction == "down") {
    let j = index;
    for (let i = LENGTH - 1; i > 0; i--) {
      if (table[i][j] !== 0 && table[i - 1][j] == table[i][j]) {
        table[i][j] = table[i][j] * 2;
        if (table[i][j] > highest) {
          highest = table[i][j];
        }
        table[i - 1][j] = 0;
        didUnite = true;
      }
    }
  } else if (direction == "right") {
    let i = index;
    for (let j = 0; j < LENGTH - 1; j++) {
      if (table[i][j] !== 0 && table[i][j + 1] == table[i][j]) {
        table[i][j] = table[i][j] * 2;
        if (table[i][j] > highest) {
          highest = table[i][j];
        }
        table[i][j + 1] = 0;
        didUnite = true;
      }
    }
  } else if (direction == "left") {
    let i = index;
    for (let j = LENGTH - 1; j > 0; j--) {
      if (table[i][j] !== 0 && table[i][j - 1] == table[i][j]) {
        table[i][j] = table[i][j] * 2;
        if (table[i][j] > highest) {
          highest = table[i][j];
        }
        table[i][j - 1] = 0;
        didUnite = true;
      }
    }
  }
  return didUnite;
};

const handleRowOrCol = (index, direction) => {
  const isMoveValid = move(index, direction);
  const didUnite = unite(index, direction);
  move(index, direction);
  return isMoveValid || didUnite;
};

const playMove = (direction) => {
  let isDirectionValid = false;
  for (let index = 0; index < LENGTH; index++) {
    const isRowOrColValid = handleRowOrCol(index, direction);
    isDirectionValid = isDirectionValid || isRowOrColValid;
  }
  return isDirectionValid;
};

const addNumber = () => {
  const zeros = [];
  for (let i = 0; i < LENGTH; i++) {
    for (let j = 0; j < LENGTH; j++) {
      if (table[i][j] == 0) {
        zeros.push([i, j]);
      }
    }
  }
  const zeroCount = zeros.length;
  let randIndex = Math.floor(Math.random() * zeroCount);
  const [i, j] = zeros[randIndex];
  const randNum = Math.random();
  if (randNum > 0.9) {
    table[i][j] = 4;
  } else {
    table[i][j] = 2;
  }
};

const isGameOver = () => {
  // are there 0s
  for (let i = 0; i < LENGTH; i++) {
    for (let j = 0; j < LENGTH; j++) {
      if (table[i][j] == 0) {
        return false;
      }
    }
  }
  // if not - are there adjacent same numbers
  for (let i = 0; i < LENGTH; i++) {
    for (let j = 0; j < LENGTH; j++) {
      if (
        (i > 0 && table[i][j] == table[i - 1][j]) ||
        (i < LENGTH - 1 && table[i][j] == table[i + 1][j]) ||
        (j > 0 && table[i][j] == table[i][j - 1]) ||
        (j < LENGTH && table[i][j] == table[i][j + 1])
      ) {
        return false;
      }
    }
  }
  return true;
};

let direction;
addNumber();
addNumber();
while (!isGameOver() && highest !== WINNING_SCORE) {
  printTable();
  let isDirectionValid = false;
  while (!isDirectionValid) {
    direction = prompt();

    switch (direction) {
      case "w":
        isDirectionValid = playMove("up");
        break;

      case "z":
        isDirectionValid = playMove("down");
        break;

      case "s":
        isDirectionValid = playMove("right");
        break;

      case "a":
        isDirectionValid = playMove("left");
        break;

      default: {
      }
    }
  }

  addNumber();
}
printTable();
if (highest === WINNING_SCORE) {
  console.log("VICTORY!!!");
} else {
  console.log("GAME OVER");
}
