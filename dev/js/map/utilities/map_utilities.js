import { BitmapText, Container, app } from '../../_game.js';
import { chunkActualSize, chunkTileSize } from '../macro/shaderMaps.js';
import { seed } from '../macro/shaderMaps.js';
import { uiStyle } from '../../ui/ui_design.js';

export let coordinates = {
    // Coordinate of the chunk itself.
    chunk: {
        x: 20,
        y: 20,
    },
    player: {
        // This is where the player starts in the chunk.
        chunk: {
            x: 200,
            y: 200,
        },
        world: null,
    }
};

export function normalize(val) {
    return (val + 1) / 2;
}

export function denormalize(val) {
    return (val * 2) - 1;
}

export function generateCoordinates() {
    // Coordinate of the chunk itself.
    let chunkX = coordinates.chunk.x;
    let chunkY = coordinates.chunk.y;

    // Player's coordinate in respect to the currently occupied chunk.
    let playerToChunkX = Math.floor(coordinates.player.chunk.x / (chunkTileSize / 2));
    let playerToChunkY = Math.floor(coordinates.player.chunk.y / (chunkTileSize / 1.4));

    // Player's coordinate in respect to the whole world.
    let playerX = Math.floor(((chunkX * chunkActualSize) + playerToChunkX + app.view.width / 2) / chunkTileSize);
    let playerY = Math.floor(((chunkY * chunkActualSize) + playerToChunkY + app.view.height / 2) / chunkTileSize);

    coordinates.player.chunk = {
        x: playerToChunkX,
        y: playerToChunkY
    }

    coordinates.player.world = {
        x: playerX,
        y: playerY
    }
}

let coordinatesContainer;

export function graphicCoordinates() {
    let container = new Container();
    let chunkCoordString = 'CHUNK: ' + coordinates.chunk.x + ', ' + coordinates.chunk.y;
    let playerCoordString = 'WORLD: ' + coordinates.player.world.x + ', ' + coordinates.player.world.y;
    let playerWithinChunkString = 'WITHIN CHUNK: ' + coordinates.player.chunk.x + ', ' + coordinates.player.chunk.y;

    let prefaceText = new BitmapText('Seed: ' + seed, uiStyle.text);
    container.addChild(prefaceText);

    let chunkCoordText = new BitmapText(chunkCoordString, uiStyle.text);
    chunkCoordText.y = prefaceText.height + 20;
    container.addChild(chunkCoordText);

    let playerCoordText = new BitmapText(playerCoordString, uiStyle.text);
    playerCoordText.y = chunkCoordText.height + chunkCoordText.y;
    container.addChild(playerCoordText);

    let playerWithinChunkText = new BitmapText(playerWithinChunkString, uiStyle.text);
    playerWithinChunkText.y = playerCoordText.height + playerCoordText.y;
    container.addChild(playerWithinChunkText);

    container.x = 340;
    container.y = 20;
    
    coordinatesContainer = container;
    return container;
}

export let getChunkCoords = () => coordinates.chunk;
export let setChunkCoords = (x, y) => (coordinates.chunk.x = x, coordinates.chunk.y = y);
export let setChunkCoordX = (x) => (coordinates.chunk.x = x);
export let setChunkCoordY = (y) => (coordinates.chunk.y = y);

export let getWorldCoords = () => coordinates.player.world;
export let setWorldCoords = (x, y) => (coordinates.player.world.x = x, coordinates.player.world.y = y);
export let setWorldCoordX = (x) => (coordinates.player.world.x = x);
export let setWorldCoordY = (y) => (coordinates.player.world.y = y);

export let getPlayerChunkCoords = () => coordinates.player.chunk;
export let setPlayerChunkCoords = (x, y) => (coordinates.player.chunk.x = x, coordinates.player.chunk.y = y);
export let setPlayerChunkCoordX = (x) => (coordinates.player.chunk.x = x);
export let setPlayerChunkCoordY = (y) => (coordinates.player.chunk.y = y);

// Used in loop. Watch when player moves.
export function redrawCoordinates() {
    let container = coordinatesContainer;

    let chunkCoordText = container.children[1];
    chunkCoordText.text = 'CHUNK: ' + coordinates.chunk.x + ', ' + coordinates.chunk.y;
    let playerCoordText = container.children[2];
    playerCoordText.text = 'WORLD: ' + coordinates.player.world.x + ', ' + coordinates.player.world.y;
    let playerWithinChunkText = container.children[3];
    playerWithinChunkText.text = 'WITHIN CHUNK: ' + coordinates.player.chunk.x + ', ' + coordinates.player.chunk.y;
}

export function checkPlayerChunk() {
    let chunkTotalTiles = chunkActualSize / chunkTileSize;

    // Make sure the chunk's top-left coordinate for player is 0, 0.
    let currentChunkX = coordinates.chunk.x;
    let currentChunkY = coordinates.chunk.y;
    let actualChunkX = Math.floor(coordinates.player.world.x / chunkTotalTiles);
    let actualChunkY = Math.floor(coordinates.player.world.y / chunkTotalTiles);

    if (currentChunkX !== actualChunkX || currentChunkY !== actualChunkY) {
        coordinates.chunk.x = actualChunkX;
        coordinates.chunk.y = actualChunkY;

        coordinates.player.chunk.x = coordinates.player.world.x % chunkTotalTiles;
        coordinates.player.chunk.y = coordinates.player.world.y % chunkTotalTiles;
    }
}