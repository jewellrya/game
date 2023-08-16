// 1. Chunk Definition: 32x32 tiles? Terrain type, objects present, elevation.
// 2. World coordinate System (Chunk Coordinate System: World Coordinate / 32).
// 3. Macro-Level Noise Map -> Chunk-Level Noise Map -> Tile-level.

import { gameScene } from '../_game.js';
import { Noise } from 'noisejs'; // Add a Bundler for this at some point.

export function noiseMap_macro() {
    // const noise = new Noise(Math.random());
    // const tileSize = 4;
    // const mapSize = 200;

    // for (let i = 0; i < mapSize; i++) {
    //     for (let j = 0; j < mapSize; j++) {
    //         const value = (noise.simplex2(i * 0.1, j * 0.1) + 1) / 2;  // Normalize value to [0,1]
    //         const color = (value * 255).toFixed(0);

    //         const graphics = new PIXI.Graphics();
    //         graphics.beginFill(PIXI.utils.rgb2hex([color / 255, color / 255, color / 255]));
    //         graphics.drawRect(i * tileSize, j * tileSize, tileSize, tileSize);
    //         graphics.endFill();

    //         gameScene.addChild(graphics);
    //     }
    // }
}