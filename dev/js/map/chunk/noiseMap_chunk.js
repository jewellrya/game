import { app, Graphics, Container, Sprite, RenderTexture, playerChunkX, playerChunkY } from '../../_game';
import { Noise } from 'noisejs';
import { getCombinedNoiseValue } from '../macro/noiseMap_macro';
import { getColorForChunk, normalize, getPlayerStartingChunk } from '../utilities/map_utilities';
import { objectChunkDispertion, seededRandom } from '../../entities/utilities/entities_utilities';
import { environmentSheets } from '../../sheets/environmentSheet';

let bg;

export let tileSize = 4;
let chunk_size = 1024;
let chunk_scale = 1;
export const chunk_actual_size = chunk_size * chunk_scale * tileSize;
let chunk_detail_scale = 1;
let seed = 12345;
let startingChunk = getPlayerStartingChunk();
let chunkNoiseGenerator = new Noise(seed);

function adjustDetailToMacro(macroValue, detailValue, deviationFactor) {
    // This function takes a macro value, a detail value, and a deviation factor.
    let adjustedDetail = macroValue + (detailValue - 0.5) * 2 * deviationFactor;
    return adjustedDetail;
}

// Function to generate a chunk based on macro-level position
export function generateChunkFromMacro(macroX, macroY, seed) {
    let macroValue = getCombinedNoiseValue({ x: startingChunk.x, y: startingChunk.y, seed }); // Get the value for the chunk from a 4x4 position on Macro.
    let chunk = [];

    for (let i = 0; i < chunk_size; i++) {
        chunk[i] = [];
        for (let j = 0; j < chunk_size; j++) {
            // Interpolate macro position based on chunk position
            let interpolatedMacroX = macroX + (i / (chunk_size / 4));
            let interpolatedMacroY = (macroY + (j / (chunk_size / 4))) * 1.65;

            // Generating detail noise based on the exact position in the chunk
            let detailValue = 0;
            let frequency = 1.2; // Lower = more seperated pieces
            let amplitude = 2;
            let maxAmplitude = 0;
            let octaves = 8;
            let persistence = 0.5; // lower = smoother borders.

            for (let octave = 0; octave < octaves; octave++) {
                detailValue += chunkNoiseGenerator.simplex2(interpolatedMacroX * chunk_detail_scale * frequency, (interpolatedMacroY * chunk_detail_scale * frequency) * 1.65) * amplitude;
                maxAmplitude += amplitude;
                frequency *= 2; // Double the frequency each octave to get finer details
                amplitude *= persistence; // Reduce the amplitude based on persistence
            }
            detailValue /= maxAmplitude;
            detailValue = normalize(detailValue);

            // Adjust the detail to be around the macro value
            let deviationFactor = 0.2;  // Change this to control how much the detail values can deviate from the macro value.
            chunk[i][j] = adjustDetailToMacro(macroValue, detailValue, deviationFactor);
        }
    }
    return chunk;
}

export function drawChunkGraphics(chunk) {
    let container = new Container();
    let landscape = new Graphics();

    for (let i = 0; i < chunk.length; i++) {
        for (let j = 0; j < chunk[i].length; j++) {
            let value = normalize(chunk[i][j]);
            let color = getColorForChunk(value);

            landscape.beginFill(color);
            landscape.drawRect(i * tileSize, j * tileSize, tileSize, tileSize);
            landscape.endFill();
        }
    }
    let foliage = new Container();
    function createTexture(x, y, chunkSeed) {
        let randomIndex = 1 + Math.floor(seededRandom(chunkSeed++) * 3);
        let texture = new Sprite(environmentSheets['grass_texture-' + randomIndex]);
        texture.scale.set(3);
        texture.x = x;
        texture.y = y;
        foliage.addChild(texture);
    }

    container.scale.set(chunk_scale);
    let landscapeTexture = RenderTexture.create(landscape.width, landscape.height);
    app.renderer.render(landscape, landscapeTexture);
    let landscapeSprite = new Sprite(landscapeTexture);
    container.addChild(landscapeSprite);

    objectChunkDispertion({ createEntityFn: createTexture, pushEntityFn: null, entityDensity: 1.2, objectSeed: '3812', coordX: foliage.x, coordY: foliage.y });
    let foliageTexture = RenderTexture.create(foliage.width, foliage.height);
    app.renderer.render(foliage, foliageTexture);
    let foliageSprite = new Sprite(foliageTexture);
    container.addChild(foliageSprite);

    return container;
}

// This is where the chunk's graphic is set and used!
export let getBg = () => bg;
export let setBg = (val) => (bg = val);

export let setBgX = (val) => (bg.x = val);
export let setBgY = (val) => (bg.y = val);