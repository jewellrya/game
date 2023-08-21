import { mapScene, Graphics } from '../../_game.js';
import { Noise } from 'noisejs';
import { generateChunkFromMacro, drawChunkGraphics, resolutionSize } from '../chunk/noiseMap_chunk.js';
import { getColorForMacro, getPlayerStartingChunk, normalize } from '../utilities/map_utilities.js';

// Larger persistence gives smoother landscapes with fewer high frequency details.
// Lacunarity controls the gap between successive octaves: higher = more gaps, lower = smoother connected features.
// Layering these values creates simulate a mix of both.

let macroMapScale = 0.4;
export let seed = 123456789;
export let mapSize = 200;
let chunkSize = 4;
let scale = 0.025;
let startingChunk = getPlayerStartingChunk();

export function getCombinedNoiseValue({ x, y, seed, octaves = 12, persistence = 0.4, lacunarity = 2.1, frequency = 0.5, amplitude = 1 }) {
    let total = 0;
    let maxValue = 0;  // Used for normalizing result to 0.0 - 1.0

    // Initialize noise generator with the seed.
    let noiseGenerator = new Noise(seed);

    for (let i = 0; i < octaves; i++) {
        let xOffset = x + (seed * 10);
        let yOffset = y + (seed * 10);

        total += noiseGenerator.simplex2(xOffset * frequency * scale, yOffset * frequency * scale) * amplitude;

        maxValue += amplitude;

        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return total / maxValue;
}

export function noiseMap_macro({ seed = seed }) {
    let graphics = new Graphics();

    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            let value = normalize(getCombinedNoiseValue({ x: i, y: j, seed })) // Normalize value to [0,1]
            let color = getColorForMacro(value);

            graphics.beginFill(color);
            graphics.drawRect(i * chunkSize, j * chunkSize, chunkSize, chunkSize);
            graphics.endFill();

            graphics.x = 0;
            graphics.y = 0;

        }
    }

    graphics.scale.set(macroMapScale);
    mapScene.addChild(graphics);

    let initialChunk = generateChunkFromMacro(startingChunk.x, startingChunk.y, seed);
    let chunkGraphic = drawChunkGraphics(initialChunk);

    // Draw a red square for the chunk's position.
    let tileScaled = resolutionSize * macroMapScale;
    let markerMultiplier = 6;
    let markerSize = markerMultiplier * tileScaled;

    let redMarker = new Graphics();
    let markerX = (startingChunk.x * tileScaled) - (markerSize / 2) + (tileScaled / 2);
    let markerY = (startingChunk.y * tileScaled) - (markerSize / 2) + (tileScaled / 2);
    redMarker.beginFill(0xFF0000); // red color
    redMarker.drawRect(markerX, markerY, markerSize, markerSize);
    mapScene.addChild(redMarker);

    return chunkGraphic;
}