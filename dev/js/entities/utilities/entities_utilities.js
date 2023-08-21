import { coordinates } from '../../map/utilities/map_utilities';
import { chunk_actual_size } from '../../map/chunk/noiseMap_chunk.js';
import { seed } from '../../map/macro/noiseMap_macro';

export function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function objectChunkDispertion({ createEntityFn, pushEntityFn, entityDensity, objectSeed, coordX = coordinates.player.chunk.x, coordY = coordinates.player.chunk.y }) {
    objectSeed = (parseInt(seed) * parseInt(objectSeed)).toString();
    let width = chunk_actual_size;
    let height = chunk_actual_size;
    entityDensity /= 10000;
    console.log(objectSeed);

    let totalSpots = width * height;
    let numEntities = Math.floor(totalSpots * entityDensity);
    let entities = [];
    let usedPositions = new Set();

    while (entities.length < numEntities) {
        let potentialPosition = Math.floor(seededRandom(objectSeed++) * totalSpots);

        if (!usedPositions.has(potentialPosition)) {
            usedPositions.add(potentialPosition);

            let x = potentialPosition % width + coordX;
            let y = Math.floor(potentialPosition / width) + coordY;

            let entity = createEntityFn(x, y, objectSeed);
            if (pushEntityFn) {
                pushEntityFn(entity);
            }
            entities.push(entity);
        }
    }

    return entities;
}