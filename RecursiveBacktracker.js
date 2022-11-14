// JavaScript source code
console.log("Backtracker running!");


this.cursor = { "x": 0, "y": 0 };
this.route = [{ "x": 0, "y": 0 }];

var infoRB =
    [
        "Instantiate the cursor, in this case at (0, 0)",
        "Move the cursor in a random valid direction",
        "Tear down the wall between the previous cursor position and the new one",
        "Repeat until there's no valid direction to choose from",
        "Now you move back one cell and check if it has any unvisited neighbouring cells",
        "If you have any unvisited neighbours you move to a random unvisited neighbour, if not you repeat the previous step",
        "Repeat this until your cursor is back at the start"
    ];

function GenerateRB() {
    visited = [[]];
    cursor = { "x": 0, "y": 0 };
    route = [{ "x": cursor.x, "y": cursor.y }];
    for (x = 0; x < cellsX; x++) {
        visited[x] = [];
        for (y = 0; y < cellsY; y++) {
            visited[x][y] = false;
        }
    }
    visited[cursor.x][cursor.y] = true;
    mazeCells[cursor.x][cursor.y].tags.push("cursor");
    DrawCell(cursor.x, cursor.y);

    Loop(MoveRB, () => {
        if (route.length <= 0) {
            mazeCells[cursor.x][cursor.y].tags.push("generated");
            RemoveTag(cursor.x, cursor.y, "cursor");
            clearInterval(loop);
            DrawGrid();
        }
    });
}

this.MoveRB = function () {

    let x = cursor.x;
    let y = cursor.y;

    let up = (y > 0 && !visited[x][y - 1]);
    let right = (x + 1 < cellsX && !visited[x + 1][y]);
    let down = (y + 1 < cellsY && !visited[x][y + 1]);
    let left = (x > 0 && !visited[x - 1][y]);

    if (!up && !right && !down && !left) {
        this.RecurseRB();
        return;
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
    mazeCells[x][y].tags.push("visited");

    mazeCells[x][y].walls[random] = false;
    mazeCells[cursor.x][cursor.y].walls[(random + 2) % 4] = false;

    DrawCell(x, y);
    DrawCell(cursor.x, cursor.y);

    route.push({ "x": cursor.x, "y": cursor.y });
    visited[cursor.x][cursor.y] = true;
}

this.RecurseRB = function () {
    route.pop();
    if (route.length <= 0)
        return true;

    let x = cursor.x;
    let y = cursor.y;
    cursor = { "x": route[route.length - 1].x, "y": route[route.length - 1].y };
    mazeCells[x][y].tags.push("generated");

    RemoveTag(x, y, "cursor");
    mazeCells[cursor.x][cursor.y].tags.push("cursor");

    DrawCell(x, y);
    DrawCell(cursor.x, cursor.y);

    x = cursor.x;
    y = cursor.y;
    let up = (y > 0 && !visited[x][y - 1]);
    let right = (x + 1 < cellsX && !visited[x + 1][y]);
    let down = (y + 1 < cellsY && !visited[x][y + 1]);
    let left = (x > 0 && !visited[x - 1][y]);

    return up || right || down || left;
}