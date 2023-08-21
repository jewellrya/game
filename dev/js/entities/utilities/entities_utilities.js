import { coordinates } from '../../map/utilities/map_utilities';
import { chunk_actual_size } from '../../map/chunk/noiseMap_chunk.js';

export function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function objectChunkDispertion({ createEntityFn, pushEntityFn, entityDensity, seed, coordX = coordinates.player.chunk.x, coordY = coordinates.player.chunk.y }) {
    let width = chunk_actual_size;
    let height = chunk_actual_size;
    entityDensity /= 10000;

    let totalSpots = width * height;
    let numEntities = Math.floor(totalSpots * entityDensity);
    let entities = [];
    let usedPositions = new Set();

    while (entities.length < numEntities) {
        let potentialPosition = Math.floor(seededRandom(seed++) * totalSpots);

        if (!usedPositions.has(potentialPosition)) {
            usedPositions.add(potentialPosition);

            let x = potentialPosition % width + coordX;
            let y = Math.floor(potentialPosition / width) + coordY;

            let entity = createEntityFn(x, y, seed);
            if (pushEntityFn) {
                pushEntityFn(entity);
            }
            entities.push(entity);
        }
    }

    return entities;
}