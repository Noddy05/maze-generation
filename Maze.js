console.log("Main running!");
var _algorithm = document.getElementById("algorithm");
var _algorithmInfo = document.getElementById("algorithm-info");
var _rchSlot = document.getElementById("rch-slot");
var _rchValue = document.getElementById("rch");

var _canvas = document.getElementById("canvas");
var _ctx = _canvas.getContext("2d");
_canvas.width = 5000;
_canvas.height = 5000;

UpdateAlgorithmInfo();
_algorithm.addEventListener('change', (event) => {
    UpdateAlgorithmInfo();
});

function UpdateAlgorithmInfo() {
    let result = _algorithm.value;

    _rchSlot.style.display = "none";
    switch (result) {
        case "RB":
            _algorithmInfo.innerHTML = InterpretInfo(infoRB);
            break;
        case "HK":
            _algorithmInfo.innerHTML = InterpretInfo(infoHK);
            break;
        case "RP":
            _algorithmInfo.innerHTML = InterpretInfo(infoRP);
            break;
        case "BG":
            _algorithmInfo.innerHTML = InterpretInfo(infoBG);
            _rchSlot.style.display = "block";
            break;
    }
}

function InterpretInfo(info) {
    let output = "";
    for (let i = 0; i < info.length; i++) {
        output += (i + 1) + ") " + info[i] + "<br>";
    }

    return output;
}

//Maze cell struct will contain a list of tags and the walls [top, right, bottom, left]
var mazeCells = [[]];
var tags =
{
    "unvisited": { "weight": 0, "color": "white" },
    "visited": { "weight": 1, "color": "green" },
    "generated": { "weight": 2, "color": "darkgreen" },
    "cursor": { "weight": 10, "color": "red" },
};
var wallColor = "black";
var cellsX = 7;
var cellsY = 6;
var cellWidth = _canvas.width / cellsX;
var cellHeight = _canvas.height / cellsY;
var wallThickness = 5;

var visited = [[]];

function GenerateMaze() {
    clearInterval(loop);
    GenerateGrid();

    switch (_algorithm.value) {
        case "RB":
            GenerateRB();
            break;
        case "HK":
            GenerateHK();
            break;
        case "RP":
            GenerateRP();
            break;
        case "BG":
            GenerateBG();
            break;
    }
}

var loop = null;
function Loop(update, stopCheck) {
    loop = setInterval(() => {
        update();
        stopCheck();
    }, 100);
}

var loop = null;
function WhileLoop(update, after) {
    loop = setInterval(() => {
        if (!update())
            return;
        clearInterval(loop);
        loop = null;
        if (after != null)
            after();
    }, 100);
}

GenerateGrid();
function GenerateGrid() {
    mazeCells = [[]];
    for (let x = 0; x < cellsX; x++) {
        mazeCells[x] = [];
        for (let y = 0; y < cellsY; y++) {
            mazeCells[x][y] = { "tags": ["unvisited"], "walls": [true, true, true, true] };
        }
    }
    DrawGrid();
}

function DrawGrid() {
    _ctx.fillStyle = "white";
    _ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < cellsY; y++) {
        for (let x = 0; x < cellsX; x++) {
            DrawCell(x, y);
        }
    }
}

function DrawCell(x, y) {
    _ctx.fillStyle = HighestTag(mazeCells[x][y].tags).color;
    _ctx.fillRect(x * cellWidth - 1, y * cellHeight - 1, cellWidth + 2, cellHeight + 2);
    DrawWalls(x, y);
}

function DrawWalls(x, y) {
    _ctx.fillStyle = wallColor;
    if (mazeCells[x][y].walls[0]) {
        _ctx.fillRect(x * cellWidth - 1, y * cellHeight - 1, cellWidth + 2, wallThickness + 2);
    }
    if (mazeCells[x][y].walls[1]) {
        _ctx.fillRect((x + 1) * cellWidth - wallThickness - 1, y * cellHeight - 1, wallThickness + 2, cellHeight + 2);
    }
    if (mazeCells[x][y].walls[2]) {
        _ctx.fillRect(x * cellWidth - 1, (y + 1) * cellHeight - wallThickness - 1, cellWidth + 2, wallThickness + 2);
    }
    if (mazeCells[x][y].walls[3]) {
        _ctx.fillRect(x * cellWidth - 1, y * cellHeight - 1, wallThickness + 2, cellHeight + 2);
    }
}

function HighestTag(cellTags) {
    let highest = 0;

    for (let i = 1; i < cellTags.length; i++) {
        if (tags[cellTags[i]].weight > tags[cellTags[highest]].weight) {
            highest = i;
        }
    }

    return tags[cellTags[highest]];
}

function RemoveTag(x, y, tag) {
    for (let i = 0; i < mazeCells[x][y].tags.length; i++) {
        if (mazeCells[x][y].tags[i] == tag) {
            mazeCells[x][y].tags.splice(i, 1);
        }
    }
}

function RandomDirection(up, right, down, left) {
    let direction = TryDirection(up, right, down, left);
    while (direction < 0) {
        direction = TryDirection(up, right, down, left);
    }

    return direction;
}

function TryDirection(up, right, down, left) {
    let direction = Math.floor(Math.random() * 4);
    switch (direction) {
        case 0:
            if (up)
                return direction;
            return -1;
        case 1:
            if (right)
                return direction;
            return -1;
        case 2:
            if (down)
                return direction;
            return -1;
        case 3:
            if (left)
                return direction;
            return -1;
    }
    return -1;
}