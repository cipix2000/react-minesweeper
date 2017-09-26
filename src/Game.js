let mines = 15;

let cloneTable = (table) => {
    return table.map((e) => e.slice());
}

let neighborsCoordinates = (height, width, row, col) => {
    return [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]
    .map((pair) => [row + pair[0], col + pair[1]])
    .filter((pair) => inside(height, width, pair[0], pair[1]))
}

let countMines = (stateTable, row, col) => {
    let height = stateTable.length;
    let width = stateTable[0].length;
    let count = 0;

    neighborsCoordinates(height, width, row, col)
    .forEach((pair) => {
        let y = pair[0];
        let x = pair[1];

        if (stateTable[y][x] === -1) {
            count++;
        }
    });

    return count;
}

let countMarks = (visibilityTable, row, col) => {
    let height = visibilityTable.length;
    let width = visibilityTable[0].length;
    let count = 0;

    neighborsCoordinates(height, width, row, col)
    .forEach((pair) => {
        let y = pair[0];
        let x = pair[1];

        if (visibilityTable[y][x] === 2) {
            count++;
        }
    });

    return count;
}

let countAllMarks = (visibilityTable) => {
    let height = visibilityTable.length;
    let width = visibilityTable[0].length;
    let count = 0;

    visibilityTable.forEach((row) => {
        row.forEach((col) => {
            if (col === 2) {
                count++;
            }
        });
    });

    return count;
}


let fillCount = (stateTable) => {
    let height = stateTable.length;
    let width = stateTable[0].length;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (stateTable[i][j] === 0) {
                stateTable[i][j] = countMines(stateTable, i, j);
            }
        }
    }
}

let inside = (height, width, row, col) => {
    if (row < 0 || row >= height) {
        return false;
    }

    if (col < 0 || col >= width) {
        return false;
    }

    return true;
}

let addMines = (stateTable, n) => {
    let added = 0;
    let height = stateTable.length;
    let width = stateTable[0].length;

    while (added < n) {
        let row = Math.floor(Math.random() * height);
        let col = Math.floor(Math.random() * width);

        if (stateTable[row][col] === 0) {
            stateTable[row][col] = -1;
            added++;
        }
    }

    fillCount(stateTable);
}

let newStateTable = (width, height) => {
    let stateTable = [];
    for (var i = 0; i < height; i++) {
        var row = [];
        for (var j = 0; j < width; j++) {
            row[j] = 0;
        }
        stateTable[i] = row;
    }

    addMines(stateTable, mines);
    return stateTable;
}

let newVisbilityTable = (width, height) => {
    var visbilityTable = [];

    for (var i = 0; i < height; i++) {
        var vRow = [];
        for (var j = 0; j < width; j++) {
            vRow[j] = 0;
        }
        visbilityTable[i] = vRow;
    }

    return visbilityTable;
}

let state = (width, height, state, visibility) => {
    var newState = {};

    newState.timeRunning = false;
    newState.time = 0;
    newState.startTime = null;
    newState.mines = mines;
    newState.status = 0;
    newState.width = width;
    newState.height = height;
    newState.stateTable = newStateTable(width, height);
    newState.visibilityTable = newVisbilityTable(width, height);

    return newState;
}

let clone = (state) => {
    var newState = {};

    newState.timeRunning = state.timeRunning;
    newState.time = state.time;
    newState.startTime = state.startTime;
    newState.mines = mines;
    newState.status = state.status;
    newState.width = state.width;
    newState.height = state.height;
    newState.stateTable = state.stateTable;
    newState.visibilityTable = cloneTable(state.visibilityTable);

    return newState;
}

let reveal = (state, pairs) => {
    while (pairs.length > 0) {
        let pair = pairs.shift();
        let row = pair[0];
        let col = pair[1];

        if (state.visibilityTable[row][col] === 0 && state.stateTable[pair[0]][pair[1]] === 0) {
            neighborsCoordinates(state.width, state.height, row, col)
            .filter((pair) => state.visibilityTable[pair[0]][pair[1]] === 0 &&
                               state.stateTable[pair[0]][pair[1]] !== -1)
            .forEach((pair) => {pairs.push(pair)})
        }

        if (state.stateTable[row][col] === -1) {
            fail(state, row, col);
            return;
        } else {
            state.visibilityTable[row][col] = 1;
        }
    }
}

let fail = (state, row, col) => {
    for (var i = 0; i < state.height; i++) {
        for (var j = 0; j < state.width; j++) {
            if (state.stateTable[i][j] === -1) {
                state.visibilityTable[i][j] = 3;
            }
        }
    }

    state.visibilityTable[row][col]= 4;
    state.status = 1;
    tick(state);
    state.timeRunning = false;
}

let updateStatus = (state) => {
    let finished = true;

    if (state.status === 0) {
        for (var i = 0; i < state.height; i++) {
            for (var j = 0; j < state.width; j++) {
                if (state.stateTable[i][j] === -1 && state.visibilityTable[i][j] !== 2)  {
                    finished = false;
                }

                if (state.stateTable[i][j] !== -1 && state.visibilityTable[i][j] !== 1) {
                    finished = false;
                }
            }
        }
        state.mines = mines - countAllMarks(state.visibilityTable);

        if (finished) {
            state.status = 2;
            tick(state);
            state.timeRunning = false;
        }
    }
}

let startTimer = (state) => {
    if (!state.timeRunning) {
        state.time = 0;
        state.startTime = Date.now();
        state.timeRunning = true;
    }
}

let tick = (state) => {
    if (state.timeRunning) {
        state.time = Math.floor((Date.now() - state.startTime)/1000);
    }

    return state;
}

let click = (row, col, state) => {
    if (state.status !== 0) {
        return state;
    }

    let newState = clone(state);

    startTimer(newState);

    if (state.visibilityTable[row][col] === 2) {
        return newState;
    }

    if (newState.visibilityTable[row][col] === 1) {
        if (countMarks(newState.visibilityTable, row, col) === newState.stateTable[row][col]) {
            // reveal around
            let pairs = neighborsCoordinates(newState.height, newState.width, row, col)
            .filter((pair) => newState.visibilityTable[pair[0]][pair[1]] === 0)

            reveal(newState, pairs);
        }

        updateStatus(newState);

        return newState;
    }

    if (newState.stateTable[row][col] === 0) {
        reveal(newState, [[row, col]]);
    } else if (newState.stateTable[row][col] === -1) {
        // fail game
        fail(newState, row, col);
    } else {
        newState.visibilityTable[row][col]= 1;
    }

    updateStatus(newState);
    return newState;
}

let rightClick = (row, col, state) => {
    if (state.status !== 0) {
        return state;
    }

    var newState = clone(state);

    startTimer(newState);

    if (newState.visibilityTable[row][col] === 2) {
        newState.visibilityTable[row][col] = 0;
    } else if (newState.visibilityTable[row][col] === 0) {
        newState.visibilityTable[row][col] = 2;
    }

    updateStatus(newState);
    return newState;
}


let Game = {
    state,
    click,
    rightClick,
    tick
};

export default Game;
