import { app, map, mapScene, Container, Graphics, Filter, Sprite, RenderTexture, Texture, Rectangle, Point } from '../../_game.js';
import { objectChunkDispertion, seededRandom } from '../../entities/utilities/entities_utilities.js';
import { environmentSheets } from '../../sheets/environmentSheet.js';
import macroShader_noiseGradient from '../../shaders/macroShader_noiseGradient.glsl';
import macroShader_color from '../../shaders/macroShader_colors.glsl';
import chunkShader from '../../shaders/chunkShader.glsl';
import { coordinates } from '../utilities/map_utilities.js';

export let seed = 44444444;
export let mapSize = 200;
let startingChunk = coordinates.chunk;
let macroSize = 320.0;
let chunkSize = 1024.0;
export let chunkSampleSize = 4.0;
export let chunkActualSize = chunkSize * chunkSampleSize;
export let chunkTileSize = chunkSampleSize * 8;
export let redMarker;

let bg;
let generatedChunks = [];
let currentChunk;
export let setCurrentChunk = (val) => currentChunk = val;
export let chunkSprites = {};

// Shader
const vertex = ` 
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    uniform mat3 projectionMatrix;
    varying vec2 vTextureCoord;
    void main(void) {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
    }
`;

function hashSeed(seed) {
    let x = (Math.sin(seed + 1) * 10000) % 1;
    let y = (Math.sin(seed + 2) * 10000) % 1;
    return new Point(x, y);
}

function generateMacroTexture(shader, app, scene) {
    const noiseFilter = new Filter(vertex, shader);
    let tempSprite = new Sprite(Texture.WHITE);
    let textureSize = macroSize;
    tempSprite.width = textureSize;
    tempSprite.height = textureSize;
    tempSprite.filterArea = new Rectangle(0, 0, textureSize, textureSize);
    scene.addChild(tempSprite);
    tempSprite.filters = [noiseFilter];

    // Setting the seed for the shader
    let hashedSeed = hashSeed(seed);
    noiseFilter.uniforms.seed = [hashedSeed.x, hashedSeed.y];

    // Render the temporary sprite with macroRenderTexture.
    let renderTexture = RenderTexture.create({
        width: tempSprite.width,
        height: tempSprite.height
    });

    app.renderer.render(tempSprite, renderTexture);
    scene.removeChild(tempSprite);

    return renderTexture;
}

let macroGenerated = false;
let macroVisual;
let macroRenderTexture;

function generateChunk(chunkCoordX, chunkCoordY) {
    
    if (!macroGenerated) {
        generateMacroTexture(macroShader_color, map, mapScene);
        macroVisual = new Sprite(generateMacroTexture(macroShader_color, map, mapScene));
        mapScene.addChild(macroVisual);
        macroRenderTexture = generateMacroTexture(macroShader_noiseGradient, app, app.stage);

        macroGenerated = true;
    }

    const chunkFilter = new Filter(vertex, chunkShader);
    let chunkTempSprite = new Sprite(Texture.WHITE);
    chunkTempSprite.width = chunkSize;
    chunkTempSprite.height = chunkSize;
    chunkTempSprite.filterArea = new Rectangle(0, 0, chunkSize, chunkSize);
    app.stage.addChild(chunkTempSprite);
    
    let hashedSeed = hashSeed(seed);
    chunkTempSprite.filters = [chunkFilter];
    chunkFilter.uniforms.macroTexture = macroRenderTexture;
    chunkFilter.uniforms.deviationFactor = .2;
    chunkFilter.uniforms.seed = [hashedSeed.x, hashedSeed.y];
    chunkFilter.uniforms.chunkCoord = [chunkCoordX, chunkCoordY];
    chunkFilter.uniforms.macroSize = macroSize;
    chunkFilter.uniforms.chunkSize = chunkSize;
    chunkFilter.uniforms.chunkSampleSize = chunkSampleSize;

    let chunkRenderTexture = RenderTexture.create({
        width: chunkTempSprite.width,
        height: chunkTempSprite.height
    });
    app.renderer.render(chunkTempSprite, chunkRenderTexture);
    app.stage.removeChild(chunkTempSprite);

    // Make a new sprite that contains this chunk rendered texture.
    let chunkTextureSprite = new Sprite(chunkRenderTexture);
    chunkTextureSprite.scale.set(4);

    let chunkIdentifier = chunkCoordX + ' ' + chunkCoordY;
    generatedChunks.push(chunkIdentifier);
    chunkSprites[chunkIdentifier] = chunkTextureSprite;

    return chunkTextureSprite;
}

function generateFoliage() {
    let foliage = new Container();
    function createFoliage(x, y, chunkSeed) {
        let randomIndex = 1 + Math.floor(seededRandom(chunkSeed++) * 3);
        let texture = new Sprite(environmentSheets['grass_texture-' + randomIndex]);
        texture.scale.set(3);
        texture.x = x;
        texture.y = y;
        foliage.addChild(texture);
    }

    objectChunkDispertion({ createObjectFn: createFoliage, pushObjectFn: null, objectDensity: 1.2, objectSeed: '123', coordX: foliage.x, coordY: foliage.y });
    let foliageTexture = RenderTexture.create(foliage.width, foliage.height);
    app.renderer.render(foliage, foliageTexture);
    let foliageSprite = new Sprite(foliageTexture);
    
    return foliageSprite;
}

export function generateInitialChunk({ seed = seed }) {
    let container = new Container();

    // Generate Initial Chunk:
    let chunkSprite = generateChunk(startingChunk.x, startingChunk.y);
    chunkSprite.x = 0;
    currentChunk = chunkSprite;
    container.addChild(chunkSprite);

    let foliage = generateFoliage();
    container.addChild(foliage);

    // Draw a red square for the chunk's position.
    redMarker = new Graphics();
    let markerSize = 12;
    let markerX = (startingChunk.x * chunkSampleSize) - (markerSize - chunkSampleSize) / 2;
    let markerY = (startingChunk.y * chunkSampleSize) - (markerSize - chunkSampleSize) / 2;
    redMarker.beginFill(0xFF0000, 1);
    redMarker.drawRect(markerX, markerY, markerSize, markerSize);
    mapScene.addChild(redMarker);


    return container;
}

// This is where the chunk's graphic is set and used!
export let getBg = () => bg;
export let setBg = (val) => (bg = val);

export let setBgX = (val) => (bg.x = val);
export let setBgY = (val) => (bg.y = val);

// Track Chunk Coordinates
// Determine Neighboring Chunks.
// Check and Generate the missing chunk.

let borderThreshold = 40;

export function checkAndGenerateChunks() {
    let currentChunkX = coordinates.chunk.x;
    let currentChunkY = coordinates.chunk.y;
    let chunkTotalTiles = chunkActualSize / chunkTileSize;
    let playerCoordinateWithinChunk = coordinates.player.chunk;

    let chunkBorder = {
        left: 0 + borderThreshold,
        right: chunkTotalTiles - borderThreshold,
        top: 0 + borderThreshold,
        bottom: chunkTotalTiles - borderThreshold,
    }

    // Check the player's position within the chunk against the borders
    if (playerCoordinateWithinChunk.x <= chunkBorder.left) {
        generateIfMissing(currentChunkX - 1, currentChunkY);
    }
    if (playerCoordinateWithinChunk.x >= chunkBorder.right) {
        generateIfMissing(currentChunkX + 1, currentChunkY);
    }
    if (playerCoordinateWithinChunk.y <= chunkBorder.top) {
        generateIfMissing(currentChunkX, currentChunkY - 1);
    }
    if (playerCoordinateWithinChunk.y >= chunkBorder.bottom) {
        generateIfMissing(currentChunkX, currentChunkY + 1);
    }

    // Check diagonals
    if (playerCoordinateWithinChunk.x <= chunkBorder.left && playerCoordinateWithinChunk.y <= chunkBorder.top) {
        generateIfMissing(currentChunkX - 1, currentChunkY - 1); // Top-left
    }
    if (playerCoordinateWithinChunk.x >= chunkBorder.right && playerCoordinateWithinChunk.y <= chunkBorder.top) {
        generateIfMissing(currentChunkX + 1, currentChunkY - 1); // Top-right
    }
    if (playerCoordinateWithinChunk.x <= chunkBorder.left && playerCoordinateWithinChunk.y >= chunkBorder.bottom) {
        generateIfMissing(currentChunkX - 1, currentChunkY + 1); // Bottom-left
    }
    if (playerCoordinateWithinChunk.x >= chunkBorder.right && playerCoordinateWithinChunk.y >= chunkBorder.bottom) {
        generateIfMissing(currentChunkX + 1, currentChunkY + 1); // Bottom-right
    }
}

function generateIfMissing(x, y) {
    let chunkIdentifier = `${x} ${y}`;
    if (generatedChunks.includes(chunkIdentifier)) {
        return;
    }
    let newChunk = generateChunk(x, y);

    let deltaX = x - coordinates.chunk.x;
    let deltaY = y - coordinates.chunk.y;
    newChunk.x = currentChunk.x + (deltaX * (chunkActualSize));
    newChunk.y = currentChunk.y + (deltaY * (chunkActualSize));

    bg.addChild(newChunk);
    console.log('Generated Chunk', chunkIdentifier);
}