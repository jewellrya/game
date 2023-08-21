import { coordinates } from '../../map/utilities/map_utilities';
import { chunk_actual_size } from '../../map/chunk/noiseMap_chunk.js';
import { seed } from '../../map/macro/noiseMap_macro';

export function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function objectChunkDispertion({ createObjectFn, pushObjectFn, objectDensity, objectSeed, coordX = coordinates.player.chunk.x, coordY = coordinates.player.chunk.y }) {
    objectSeed = (parseInt(seed) * parseInt(objectSeed)).toString();
    let width = chunk_actual_size;
    let height = chunk_actual_size;
    objectDensity /= 10000;
    console.log(objectSeed);

    let totalSpots = width * height;
    let numObjects = Math.floor(totalSpots * objectDensity);
    let objects = [];
    let usedPositions = new Set();

    while (objects.length < numObjects) {
        let potentialPosition = Math.floor(seededRandom(objectSeed++) * totalSpots);

        if (!usedPositions.has(potentialPosition)) {
            usedPositions.add(potentialPosition);

            let x = potentialPosition % width + coordX;
            let y = Math.floor(potentialPosition / width) + coordY;

            let object = createObjectFn(x, y, objectSeed);
            if (pushObjectFn) {
                pushObjectFn(object);
            }
            objects.push(object);
        }
    }

    return objects;
}