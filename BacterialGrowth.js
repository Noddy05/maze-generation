// JavaScript source code
console.log("Bacterias running!");



this.bacterias = [{ "x": 0, "y": 0 }];
this.previousBacterias = [{ "x": 0, "y": 0 }];
this.cursor = [{ "x": 0, "y": 0 }];
this.startingBacterias = 1;

function GenerateBG() {
    bacterias = [];
    previousBacterias = [];

    for (let i = 0; i < startingBacterias; i++) {
        while (!this.NewBacteriaBG());
    }

    visited = [[]];
    cursor = [{ "x": 0, "y": 0 }];
    for (x = 0; x < cellsX; x++) {
        visited[x] = [];
        for (y = 0; y < cellsY; y++) {
            visited[x][y] = false;
        }
    }
    for (let i = 0; i < bacterias.length; i++) {
        mazeCells[bacterias[i].x][bacterias[i].y].tags.push("generated");
        DrawCell(bacterias[i].x, bacterias[i].y);
        visited[bacterias[i].x][bacterias[i].y] = true;
    }

    Loop(GrowBG, () => {
        if (bacterias.length >= cellsX * cellsY) {
            for (let i = 0; i < bacterias.length; i++) {
                let x = bacterias[i].x;
                let y = bacterias[i].y;
                mazeCells[x][y].tags.push("generated");
            }
            clearInterval(loop);
        }
    });
}

this.NewBacteriaBG = function () {
    let x = Math.floor(Math.random() * cellsX);
    let y = Math.floor(Math.random() * cellsY);

    for (let i = 0; i < bacterias.length; i++) {
        if (bacterias[i].x == x && bacterias[i].y == y)
            return false;
    }

    bacterias.push({ "x": x, "y": y });
    return true;
}

this.GrowBG = function () {
    for (let i = 0; i < previousBacterias.length; i++) {
        let x = previousBacterias[i].x;
        let y = previousBacterias[i].y;
        mazeCells[x][y].tags.push("generated");
        DrawCell(x, y);
    }

    let n = bacterias.length;
    let indexes = [];
    for (let i = 0; i < n; i++) {
        indexes.push(i);
    }
    for (let i = 0; i < n; i++) {
        let temp = indexes[i];
        let rand = Math.floor(Math.random() * indexes.length);
        indexes[i] = indexes[rand];
        indexes[rand] = temp;
    }

    for (let i = 0; i < n; i++) {
        let index = indexes[i];

        let x = bacterias[index].x;
        let y = bacterias[index].y;

        let up = (y > 0 && !visited[x][y - 1]);
        let right = (x + 1 < cellsX && !visited[x + 1][y]);
        let down = (y + 1 < cellsY && !visited[x][y + 1]);
        let left = (x > 0 && !visited[x - 1][y]);

        if (up || right || down || left) {
            let direction = this.RandomDirection(up, right, down, left);
            while (direction < 0) {
                direction = this.RandomDirection(up, right, down, left);
            }

            switch (direction) {
                case 0:
                    bacterias.push({ "x": x, "y": y - 1 });
                    break;
                case 1:
                    bacterias.push({ "x": x + 1, "y": y });
                    break;
                case 2:
                    bacterias.push({ "x": x, "y": y + 1 });
                    break;
                case 3:
                    bacterias.push({ "x": x - 1, "y": y });
                    break;
            }

            let newCell = bacterias[bacterias.length - 1];
            mazeCells[x][y].walls[direction] = false;
            mazeCells[newCell.x][newCell.y].walls[(direction + 2) % 4] = false;

            mazeCells[newCell.x][newCell.y].tags.push("visited");
            visited[newCell.x][newCell.y] = true;

            DrawCell(x, y);
            DrawCell(newCell.x, newCell.y);
        }
    }

    previousBacterias = [];
    for (let i = 0; i < bacterias.length; i++) {
        previousBacterias.push(bacterias[i]);
    }
}