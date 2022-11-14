// JavaScript source code
console.log("Hunt and Kill running!");

this.cursor = { "x": 0, "y": 0 };
this.visitedCells = [{ "x": 0, "y": 0 }];

var infoHK =
    [
        "Instantiate the cursor, in this case at (0, 0)",
        "Move the cursor in a random valid direction",
        "Tear down the wall between the previous cursor position and the new one",
        "Repeat until there's no valid direction to choose from",
        "Now you enter hunt mode, search random cells you've visited and pick that one as the new cursor if it has a valid direction to choose from",
        "Repeat the previous steps until every cell has been visited"
    ];

function GenerateHK() {
    visitedCells = [];

    visited = [[]];
    cursor = { "x": 0, "y": 0 };
    for (x = 0; x < cellsX; x++) {
        visited[x] = [];
        for (y = 0; y < cellsY; y++) {
            visited[x][y] = false;
        }
    }
    visitedCells.push({ "x": cursor.x, "y": cursor.y });

    mazeCells[visitedCells[0].x][visitedCells[0].y].tags.push("cursor");
    DrawCell(visitedCells[0].x, visitedCells[0].y);
    visited[visitedCells[0].x][visitedCells[0].y] = true;

    Loop(MoveHK, () => {
        if (visitedCells.length >= cellsX * cellsY) {
            mazeCells[cursor.x][cursor.y].tags.push("generated");
            RemoveTag(cursor.x, cursor.y, "cursor");
            clearInterval(loop);
            DrawGrid();
        }
    });
}

this.MoveHK = function () {

    let x = cursor.x;
    let y = cursor.y;

    let up = (y > 0 && !visited[x][y - 1]);
    let right = (x + 1 < cellsX && !visited[x + 1][y]);
    let down = (y + 1 < cellsY && !visited[x][y + 1]);
    let left = (x > 0 && !visited[x - 1][y]);

    if (!up && !right && !down && !left) {
        mazeCells[x][y].tags.push("generated");
        RemoveTag(x, y, "cursor");
        DrawCell(x, y);
        let cell = PickCellHK();
        while (cell < 0) {
            cell = PickCellHK();
        }
        cursor = { "x": visitedCells[cell].x, "y": visitedCells[cell].y };

        x = cursor.x;
        y = cursor.y;
        up = (y > 0 && !visited[x][y - 1]);
        right = (x + 1 < cellsX && !visited[x + 1][y]);
        down = (y + 1 < cellsY && !visited[x][y + 1]);
        left = (x > 0 && !visited[x - 1][y]);
    }


    let random = this.RandomDirection(up, right, down, left);
    while (random < 0) {
        random = this.RandomDirection(up, right, down, left);
    }

    switch (random) {
        case 0:
            cursor.y--;
            break;
        case 1:
            cursor.x++;
            break;
        case 2:
            cursor.y++;
            break;
        case 3:
            cursor.x--;
            break;
    }
    RemoveTag(x, y, "cursor");
    mazeCells[cursor.x][cursor.y].tags.push("cursor");
    mazeCells[x][y].tags.push("generated");

    mazeCells[x][y].walls[random] = false;
    mazeCells[cursor.x][cursor.y].walls[(random + 2) % 4] = false;

    DrawCell(x, y);
    DrawCell(cursor.x, cursor.y);

    visitedCells.push({ "x": cursor.x, "y": cursor.y });
    visited[cursor.x][cursor.y] = true;
}

this.PickCellHK = function () {
    let i = Math.floor(Math.random() * visitedCells.length);
    let x = visitedCells[i].x;
    let y = visitedCells[i].y;

    if ((x + 1 < cellsX && !visited[x + 1][y]) || (x > 0 && !visited[x - 1][y])
        || (y + 1 < cellsY && !visited[x][y + 1]) || (y > 0 && !visited[x][y - 1]))
        return i;

    return -1;
}