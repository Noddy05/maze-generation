// JavaScript source code

var floodCells = [{ "x": 0, "y": 0 }];
var values = [[]];

var start = { "x": 0, "y": 0 };
var end = { "x": cellsX - 1, "y": cellsY - 1 };
var route = [];

let index = 0;
function FloodFill() {
    floodCells = [{ "x": start.x, "y": start.y }];
    values = [[]];
    route = [];

    for (let x = 0; x < cellsX; x++) {
        values[x] = [];
        for (let y = 0; y < cellsY; y++) {
            values[x][y] = 0;
            mazeCells[x][y].tags = ["unvisited"];
        }
    }
    DrawGrid();
    route = [{ "x": end.x, "y": end.y }];
    WhileLoop(Fill, WhileLoop(TraceBack, null));
}

function Fill() {
    index++;
    let newCells = [];
    let returnState = false;

    for (let i = 0; i < floodCells.length; i++) {
        let x = floodCells[i].x, y = floodCells[i].y;
        values[x][y] = index;
        if (!mazeCells[x][y].walls[0] && y > 0 && values[x][y - 1] <= 0)
            newCells.push({ "x": x, "y": y - 1 });
        if (!mazeCells[x][y].walls[1] && x + 1 < cellsX && values[x + 1][y] <= 0)
            newCells.push({ "x": x + 1, "y": y });
        if (!mazeCells[x][y].walls[2] && y + 1 < cellsY && values[x][y + 1] <= 0)
            newCells.push({ "x": x, "y": y + 1 });
        if (!mazeCells[x][y].walls[3] && x > 0 && values[x - 1][y] <= 0)
            newCells.push({ "x": x - 1, "y": y });
        mazeCells[x][y].tags.push("visited");
        DrawCell(x, y);

        if (x == end.x && y == end.y)
            returnState = true;
    }
    floodCells = [...newCells];
    return returnState;
}

function TraceBack() {
    let x = route[route.length - 1].x, y = route[route.length - 1].y;
    mazeCells[x][y].tags.push("generated");
    DrawCell(x, y);
    if (x == start.x && y == start.y)
        return true;

    let value = values[x][y];
    if (!mazeCells[x][y].walls[0] && y > 0 && values[x][y - 1] > 0
        && values[x][y - 1] < value)
        route.push({ "x": x, "y": y - 1 });
    if (!mazeCells[x][y].walls[1] && x + 1 < cellsX && values[x + 1][y] > 0
        && values[x + 1][y] < value)
        route.push({ "x": x + 1, "y": y });
    if (!mazeCells[x][y].walls[2] && y + 1 < cellsY && values[x][y + 1] > 0
        && values[x][y + 1] < value)
        route.push({ "x": x, "y": y + 1 });
    if (!mazeCells[x][y].walls[3] && x > 0 && values[x - 1][y] > 0
        && values[x - 1][y] < value)
        route.push({ "x": x - 1, "y": y });
    return false;
}