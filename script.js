const board = drawBoard();
const moveGraph = Graph();

document.querySelector("#start-button").addEventListener("click", () => {
  const targetPos = document.querySelector("#start-string").value;
  const posArray = parsePosition(targetPos);
  board.changeStart(posArray[0], posArray[1]);
});

document.querySelector("#move-button").addEventListener("click", () => {
  const targetPos = document.querySelector("#move-string").value;
  const posArray = parsePosition(targetPos);
  const res = moveGraph.knightTravails(board.knight, [
    posArray[0],
    posArray[1],
  ]);

  if (res === null) {
    return;
  }

  board.clear();

  for (let i = 1; i < res.length; ++i) {
    const order = document.createElement("span");
    order.textContent = i;
    order.classList.add("order");
    board.cells[res[i][0]][res[i][1]].appendChild(order);
  }
});

function Graph() {
  //Create a map [row, col] => [ legal moves ]
  const nodes = new Map();

  for (let row = 0; row < 8; ++row) {
    for (let column = 0; column < 8; ++column) {
      let key = `${row} ${column}`;
      nodes.set(key, []);

      const shifts = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];

      for (let shift of shifts) {
        if (
          row + shift[0] >= 0 &&
          row + shift[0] < 8 &&
          column + shift[1] >= 0 &&
          column + shift[1] < 8
        ) {
          nodes.get(key).push([row + shift[0], column + shift[1]]);
        }
      }
    }
  }

  //start and end as two-element arrays [row, col]
  function knightTravails(start, end) {
    if (
      start[0] < 0 ||
      start[0] > 7 ||
      start[1] < 0 ||
      start[1] > 7 ||
      end[0] < 0 ||
      end[0] > 7 ||
      end[1] < 0 ||
      end[1] > 7
    ) {
      return null;
    }
    const queue = [start];
    const pathToStart = new Map(); //a map of paths from each traversed node to the start
    for (let key of nodes.keys()) {
      pathToStart.set(key, null);
    }
    pathToStart.set(`${start[0]} ${start[1]}`, [start]);
    while (queue.length > 0) {
      const current = queue.shift();
      const key = `${current[0]} ${current[1]}`; //key of current element in the node map
      if (+current[0] === +end[0] && +current[1] === +end[1]) {
        return pathToStart.get(key);
      }

      for (let neighbour of nodes.get(key)) {
        const neighbourKey = `${neighbour[0]} ${neighbour[1]}`;
        if (pathToStart.get(neighbourKey) !== null) {
          continue;
        }

        //Neighbour's path to the start
        const newPath = [];
        newPath.push(...pathToStart.get(key));
        newPath.push(neighbour);

        pathToStart.set(neighbourKey, newPath);
        queue.push(neighbour);
      }
    }
  }

  return { nodes, knightTravails };
}

function drawBoard() {
  const boardDOM = document.querySelector(".board");
  const board = [];
  const knight = [0, 0];
  const img = document.createElement("img");
  img.src = "horse.png";
  init();

  function init() {
    for (let i = 0; i < 8; ++i) {
      let color = i % 2 === 0 ? `white` : `black`;
      let index = 8 - i;
      let indexDOM = document.createElement("div");
      indexDOM.className = "index";
      indexDOM.textContent = index;
      board.unshift([]);
      boardDOM.appendChild(indexDOM);
      for (let j = 0; j < 8; ++j) {
        let cell = document.createElement("div");
        cell.classList.add("cell", color);
        color = color == `black` ? `white` : `black`;
        board[0].push(cell);
        boardDOM.appendChild(cell);
      }
    }

    boardDOM.appendChild(document.createElement("div"));
    for (let i = 0; i < 8; ++i) {
      let indexDOM = document.createElement("div");
      indexDOM.className = "index";
      indexDOM.textContent = "ABCDEFGH"[i];
      boardDOM.appendChild(indexDOM);
    }

    changeStart(knight[0], knight[1]);
  }

  function changeStart(row, column) {
    if (row < 0 || row > 7 || column < 0 || column > 7) {
      return;
    }
    let knightImage = board[knight[0]][knight[1]].querySelector("img");
    if (knightImage) {
      knightImage.remove();
    }
    knight[0] = +row;
    knight[1] = +column;
    board[knight[0]][knight[1]].appendChild(img);
  }

  function clear() {
    document.querySelectorAll(".order").forEach((e) => e.remove());
  }

  return { cells: board, knight, changeStart, clear };
}

//string -> [row, col]
function parsePosition(pos) {
  if (pos.length != 2) {
    return [-1, -1];
  }
  pos = pos.toUpperCase();
  if (pos[0] > "H" || pos[0] < "A" || pos[1] > "8" || pos[1] < "1") {
    return [-1, -1];
  }
  return [+pos[1] - 1, pos.charCodeAt(0) - "A".charCodeAt(0)];
}
