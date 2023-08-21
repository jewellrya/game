import { BitmapText, Container, app } from '../../_game.js';
import { chunk_actual_size, tileSize } from '../chunk/noiseMap_chunk';
import { seed } from '../macro/noiseMap_macro.js';
import { uiStyle } from '../../ui/ui_design.js';

export let coordinates;

export function normalize(val) {
    return (val + 1) / 2;
}

export function denormalize(val) {
    return (val * 2) - 1;
}

export function getColorForMacro(value) {
    if (value < 0.28) return 0x000d9e; // Deep Lake
    if (value < 0.35) return 0x0088ff; // Lake
    if (value < 0.38) return 0x84add1; // Shallow Lake
    if (value < 0.39) return 0xafe0d3; // Shore Lake
    if (value < 0.4) return 0xe6e4d3; // Beach
    if (value < 0.413) return 0xd5e0a6; // Land Beach
    if (value < 0.54) return 0x9ac130; // Land
    if (value < 0.64) return 0x76a321 // Semi-Inland
    if (value < 0.7) return 0x2f7700 // Inland
    if (value < 0.76) return 0x4c663a // Mountainous Inland
    if (value < 0.82) return 0x919984 // Mountainous
    if (value < 0.85) return 0xd0d1c5 // High Mountainous
    return 0xf4f0e9; // Mountain Peaks
}

export function getColorForChunk(value) {
    if (value < 0) return 0x000000 // Black Testing Outside of Normalization.

    if (value < 0.28) return 0x000d9e; // Deep Lake
    if (value < 0.3) return 0x0025b1; // Deep Lake +1
    if (value < 0.32) return 0x003bc3; // Deep Lake +2

    if (value < 0.33) return 0x0053d6; // Lake -2
    if (value < 0.34) return 0x006eeb; // Lake -1
    if (value < 0.35) return 0x0088ff; // Lake
    if (value < 0.36) return 0x1c90f5; // Lake +1
    if (value < 0.365) return 0x3597ec; // Lake +2

    if (value < 0.37) return 0x4c9de4; // Shallow Lake -2
    if (value < 0.375) return 0x67a5db; // Shallow Lake -1
    if (value < 0.38) return 0x84add1; // Shallow Lake
    if (value < 0.382) return 0x8cb7d1; // Shallow Lake -2
    if (value < 0.384) return 0x93bfd1; // Shallow Lake -1

    if (value < 0.386) return 0x9ccad2; // Shore Lake -2
    if (value < 0.388) return 0xa7d7d3; // Shore Lake -1
    if (value < 0.39) return 0xafe0d3; // Shore Lake
    if (value < 0.392) return 0xbbe1d3; // Shore Lake +1
    if (value < 0.394) return 0xc6e2d3; // Shore Lake +2

    if (value < 0.396) return 0xd0e2d3; // Beach -2
    if (value < 0.398) return 0xdbe3d3; // Beach -1
    if (value < 0.4) return 0xe6e4d3; // Beach
    if (value < 0.404) return 0xe2e3ca; // Beach +1
    if (value < 0.408) return 0xdfe2c1; // Beach +2

    if (value < 0.41) return 0xdae0b7; // Land Beach -2
    if (value < 0.4) return 0xd7e0ae; // Land Beach -1
    if (value < 0.413) return 0xd4dfa5; // Land Beach
    if (value < 0.42) return 0xcddb97; // Land Beach +1
    if (value < 0.44) return 0xc6d789; // Land Beach +2

    if (value < 0.45) return 0xb8d070; // Land -2
    if (value < 0.46) return 0xa7c74d; // Land -1
    if (value < 0.54) return 0x99c030; // Land 
    if (value < 0.61) return 0x93bb2d; // Land +1
    if (value < 0.62) return 0x8bb42a; // Land +2

    if (value < 0.63) return 0x85af27; // Semi-Inland -2
    if (value < 0.64) return 0x7ca823; // Semi-Inland -1
    if (value < 0.65) return 0x76a321 // Semi-Inland
    if (value < 0.66) return 0x729b23; // Semi-Inland +1
    if (value < 0.67) return 0x688e20; // Semi-Inland +2

    if (value < 0.68) return 0x588716; // Inland -2
    if (value < 0.69) return 0x477a0b; // Inland -1
    if (value < 0.7) return 0x2f7700 // Inland
    if (value < 0.73) return 0x35730c; // Inland +1
    if (value < 0.74) return 0x3b7017; // Inland +2

    if (value < 0.745) return 0x406d21; // Mountainous Inland -2
    if (value < 0.75) return 0x456a2c; // Mountainous Inland -1
    if (value < 0.76) return 0x4c663a // Mountainous Inland
    if (value < 0.77) return 0x5b714b; // Mountainous Inland +1
    if (value < 0.775) return 0x687b59; // Mountainous Inland +2

    if (value < 0.78) return 0x748365; // Mountainous -2
    if (value < 0.79) return 0x828e74; // Mountainous -1
    if (value < 0.82) return 0x919984 // Mountainous
    if (value < 0.825) return 0xa0a693; // Mountainous +1
    if (value < 0.83) return 0xacb1a0; // Mountainous +2

    if (value < 0.84) return 0xbabdae; // High Mountainous -2
    if (value < 0.845) return 0xc5c7ba; // High Mountainous -1
    if (value < 0.85) return 0xd0d1c5 // High Mountainous
    if (value < 0.86) return 0xd7d7cc; // High Mountainous +1
    if (value < 0.87) return 0xdfded4; // High Mountainous +2

    if (value < 0.88) return 0xe6e4db; // Mountain Peaks -2
    if (value < 0.89) return 0xeeebe3; // Mountain Peaks -1

    return 0xf4f0e9; // Mountain Peaks
}

export function getPlayerStartingChunk() {
    return { x: 55, y: 40 } // Based on Chunk Coordinate
}

export function generateCoordinates() {
    let coordinateTile = tileSize * 4;

    // Coordinate of the chunk itself.
    let chunkX = getPlayerStartingChunk().x;
    let chunkY = getPlayerStartingChunk().y;

    // Player's coordinate in respect to the currently occupied chunk.
    let playerToChunkX = 0;
    let playerToChunkY = 0;

    // Player's coordinate in respect to the whole world.
    let playerX = Math.floor(((chunkX * chunk_actual_size) + playerToChunkX + app.view.width / 2) / coordinateTile);
    let playerY = Math.floor(((chunkY * chunk_actual_size) + playerToChunkY + app.view.height / 2) / coordinateTile);

    // Make coordinate object:
    coordinates = {
        chunk: {
            x: chunkX,
            y: chunkY
        },
        player: {
            chunk: {
                x: playerToChunkX,
                y: playerToChunkY
            },
            world: {
                x: playerX,
                y: playerY
            }
        }
    }
}

export function graphicCoordinates() {
    let container = new Container();
    let chunkCoordString = 'CHUNK: ' + coordinates.chunk.x + ', ' + coordinates.chunk.y;
    let playerCoordString = 'WORLD: ' + coordinates.player.world.x + ', ' + coordinates.player.world.y;

    let prefaceText = new BitmapText('Seed: ' + seed, uiStyle.text);
    container.addChild(prefaceText);

    let chunkCoordText = new BitmapText(chunkCoordString, uiStyle.text);
    chunkCoordText.y = prefaceText.height + 20;
    container.addChild(chunkCoordText);

    let playerCoordText = new BitmapText(playerCoordString, uiStyle.text);
    playerCoordText.y = chunkCoordText.height + chunkCoordText.y;
    container.addChild(playerCoordText);

    container.x = 340;
    container.y = 20;

    return container;
}

export let getChunkCoords = () => coordinates.chunk;
export let setChunkCoords = (x, y) => (coordinates.chunk.x = x, coordinates.chunk.y = y);

export let getWorldCoords = () => coordinates.player.world;
export let setWorldCoords = (x, y) => (coordinates.player.world.x = x, coordinates.player.world.y = y);

// MAKE A WAY TO UPDATE COORDINATES IN GAME LOOP.
// let chunkCoordText = mapScene.children[2].children[1];
// chunkCoordText.text = (i++).toString();