import { Graphics, Container } from '../../_game';
import { Noise } from 'noisejs';
import { getCombinedNoiseValue } from '../macro/noiseMap_macro';
import { getColorForChunk, normalize, getPlayerStartingPosition } from '../utilities/noiseMap_utilities';

let bg;

export let tileSize = 4;
let chunk_size = 1024;
let chunk_scale = 1;
let chunk_detail_scale = 1; // Smaller scale than MACRO for more details
let seed = 12345;
let startingPosition = getPlayerStartingPosition();
let chunkNoiseGenerator = new Noise(seed);

// Combining function; Decide how to mix the macro and detail values
function combineMacroAndDetail(macro, detail) {
    return (macro * 0.7 + detail * 0.3);
}

// Function to generate a chunk based on macro-level position
export function generateChunkFromMacro(macroX, macroY, seed) {
    let macroValue = getCombinedNoiseValue({ x: startingPosition.x, y: startingPosition.y, seed });
    let chunk = [];

    for (let i = 0; i < chunk_size; i++) {
        chunk[i] = [];
        for (let j = 0; j < chunk_size; j++) {
            // Interpolate macro position based on chunk position
            let interpolatedMacroX = macroX + (i / (chunk_size / 4));
            let interpolatedMacroY = (macroY + (j / (chunk_size / 4))) * 1.65;

            // Generating detail noise based on the exact position in the chunk
            let detailValue = 0;
            let frequency = 1;
            let amplitude = 1;
            let maxAmplitude = 0;

            let octaves = 4;
            let persistence = 0.5;

            for (let octave = 0; octave < octaves; octave++) {
                detailValue += chunkNoiseGenerator.simplex2(interpolatedMacroX * chunk_detail_scale * frequency, (interpolatedMacroY * chunk_detail_scale * frequency) * 1.65) * amplitude;
                maxAmplitude += amplitude;
                frequency *= 2; // Double the frequency each octave to get finer details
                amplitude *= persistence; // Reduce the amplitude based on persistence
            }
            detailValue /= maxAmplitude;
            chunk[i][j] = combineMacroAndDetail(macroValue, detailValue);
        }
    }
    return chunk;
}

export function drawChunkGraphics(chunk) {
    let container = new Container();
    let graphics = new Graphics();

    for (let i = 0; i < chunk.length; i++) {
        for (let j = 0; j < chunk[i].length; j++) {
            let value = normalize(chunk[i][j]);
            let color = getColorForChunk(value);

            graphics.beginFill(color);
            graphics.drawRect(i * tileSize, j * tileSize, tileSize, tileSize);
            graphics.endFill();
        }
    }
    container.addChild(graphics);
    container.scale.set(chunk_scale);
    return container;
}

// This is where the chunk's graphic is set and used.
export let getBg = () => bg;
export let setBg = (val) => (bg = val);

export let setBgX = (val) => (bg.x = val);
export let setBgY = (val) => (bg.y = val);