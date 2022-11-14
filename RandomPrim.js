// JavaScript source code
console.log("Prim running!");


this.cursor = { "x": 0, "y": 0 };
this.visitedCells = [{ "x": 0, "y": 0 }];
this.previousCell = { "x": 0, "y": 0 };

var infoRP =
    [
        "Mark one cell as visited, in this case at (0, 0)",
        "Pick a random cell with unvisited neighbours",
        "Expand this cell in a random valid direction",
        "Repeat until every cell has been visited",
    ];

function GenerateRP() {
    visitedCells = [];
    previousCell = { "x": 0, "y": 0 };

    visited = [[]];
    cursor = { "x": 0, "y": 0 };
    for (x = 0; x < cellsX; x++) {
        visited[x] = [];
        for (y = 0; y < cellsY; y++) {
            visited[x][y] = false;
        }
    }
    visitedCells.push({ "x": cursor.x, "y": cursor.y });

    mazeCells[visitedCells[0].x][visitedCells[0].y].tags.push("visited");
    DrawCell(visitedCells[0].x, visitedCells[0].y);
    visited[visitedCells[0].x][visitedCells[0].y] = true;
    

    Loop(ExpandRP, () => {
        if (visitedCells.length >= cellsX * cellsY) {
            mazeCells[previousCell.x][previousCell.y].tags.push("generated");
            clearInterval(loop);
            DrawGrid();
        }
    });
}

this.ExpandRP = function () {
    let cell = PickCellRP();
    while (cell < 0) {
        cell = PickCellRP();
    }

    let x = visitedCells[cell].x;
    let y = visitedCells[cell].y;

    let up = (y > 0 && !visited[x][y - 1]);
    let right = (x + 1 < cellsX && !visited[x + 1][y]);
    let down = (y + 1 < cellsY && !visited[x][y + 1]);
    let left = (x > 0 && !visited[x - 1][y]);

    let direction = this.RandomDirection(up, right, down, left);
    while (direction < 0) {
        direction = this.RandomDirection(up, right, down, left);
    }

    switch (direction) {
        case 0:
            visitedCells.push({ "x": x, "y": y - 1 });
            break;
        case 1:
            visitedCells.push({ "x": x + 1, "y": y });
            break;
        case 2:
            visitedCells.push({ "x": x, "y": y + 1 });
            break;
        case 3:
            visitedCells.push({ "x": x - 1, "y": y });
            break;
    }

    let newCell = visitedCells[visitedCells.length - 1];
    mazeCells[x][y].walls[direction] = false;
    mazeCells[newCell.x][newCell.y].walls[(direction + 2) % 4] = false;

    mazeCells[previousCell.x][previousCell.y].tags.push("generated");
    DrawCell(previousCell.x, previousCell.y)
    mazeCells[newCell.x][newCell.y].tags.push("visited");
    previousCell = { "x": newCell.x, "y": newCell.y };

    visited[newCell.x][newCell.y] = true;

    DrawCell(x, y);
    DrawCell(newCell.x, newCell.y);

}

this.PickCellRP = function () {
    let i = Math.floor(Math.random() * visitedCells.length);
    let x = visitedCells[i].x;
    let y = visitedCells[i].y;

    if ((x + 1 < cellsX && !visited[x + 1][y]) || (x > 0 && !visited[x - 1][y])
        || (y + 1 < cellsY && !visited[x][y + 1]) || (y > 0 && !visited[x][y - 1]))
        return i;

    return -1;
}