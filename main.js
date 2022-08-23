const size = 513;

function newMap(size) {
    const map = new Array(size);
    for (let x = 0; x < size; x++)
        map[x] = new Array(size);
    return map;
}

const map = newMap(size);

function fillCorner(map, size) {
    map[0][0] = Math.random();
    map[size - 1][0] = Math.random();
    map[0][size - 1] = Math.random();
    map[size - 1][size - 1] = Math.random();
}

const rnd = (a) => a * (Math.random() - 0.5);
const div = (x, y) => Math.floor(x / y);


// Diamond step
function diamond(map, sideLength, range) {
    const halfSide = div(sideLength, 2);

    for (let y = 0; y < div(size, (sideLength - 1)); y++) {
        for (let x = 0; x < div(size, (sideLength - 1)); x++) {
            let center_x = x * (sideLength - 1) + halfSide;
            let center_y = y * (sideLength - 1) + halfSide;

            let avg = (map[x * (sideLength - 1)][y * (sideLength - 1)] +
                map[x * (sideLength - 1)][(y + 1) * (sideLength - 1)] +
                map[(x + 1) * (sideLength - 1)][y * (sideLength - 1)] +
                map[(x + 1) * (sideLength - 1)][(y + 1) * (sideLength - 1)])
                / 4.0;

            map[center_x][center_y] = avg + rnd(range);
        }
    }

}



// Averaging helper function for square step to ignore out of bounds polets
function average(map, x, y, sideLength, range) {
    let counter = 0;
    let accumulator = 0;

    let halfSide = div(sideLength, 2);

    if (x != 0) {
        counter += 1.0
        accumulator += map[x - halfSide][y];
    }
    if (y != 0) {
        counter += 1.0
        accumulator += map[x][y - halfSide];
    }
    if (x != size - 1) {
        counter += 1.0
        accumulator += map[x + halfSide][y];
    }
    if (y != size - 1) {
        counter += 1.0
        accumulator += map[x][y + halfSide];
    }

    map[x][y] = (accumulator / counter) + rnd(range);
}

// Square step
function square(map, sideLength, range) {
    let halfLength = div(sideLength, 2);

    for (let y = 0; y < div(size, (sideLength - 1)); y++) {
        for (let x = 0; x < div(size, (sideLength - 1)); x++) {
            // Top
            average(map, x * (sideLength - 1) + halfLength, y * (sideLength - 1), sideLength, range);
            // Right
            average(map, (x + 1) * (sideLength - 1), y * (sideLength - 1) + halfLength, sideLength, range);
            // Bottom
            average(map, x * (sideLength - 1) + halfLength, (y + 1) * (sideLength - 1), sideLength, range);
            // Left
            average(map, x * (sideLength - 1), y * (sideLength - 1) + halfLength, sideLength, range);
        }
    }
}


function diamondsquare() {
    const map = newMap(size);
    fillCorner(map, size);

    let sideLength = div(size, 2);
    let range = 1;
    diamond(map, size, range);
    square(map, size, range);

    range /= 2;

    while (sideLength >= 2) {
        diamond(map, sideLength + 1, range);
        square(map, sideLength + 1, range);
        sideLength /= 2;
        range /= 2;
    }

    return map;
}


function init() {
    const map = diamondsquare(size);

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    for (let x = 0; x < size; x++)
        for (let y = 0; y < size; y++) {
            const v = Math.floor(64 * Math.min(1, Math.max(0, map[x][y])));
            ctx.fillStyle = `rgb(${v}, ${v}, ${v})`
            ctx.fillRect(x, y, 5, 5);

        }
}


window.onload = init;
