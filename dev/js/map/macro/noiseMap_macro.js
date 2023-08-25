import {  Graphics, app, Point, Filter, Sprite, RenderTexture, Texture, Rectangle, Container, mapScene, map } from '../../_game.js';
import { getPlayerStartingChunk } from '../utilities/map_utilities.js';
import { objectChunkDispertion, seededRandom } from '../../entities/utilities/entities_utilities.js';
import { environmentSheets } from '../../sheets/environmentSheet.js';
import macroShader_noiseGradient from '../../shaders/macroShader_noiseGradient.glsl';
import macroShader_color from '../../shaders/macroShader_colors.glsl';
import chunkShader from '../../shaders/chunkShader.glsl';
import * as PIXI from 'pixi.js';

export let seed = 123456789;
export let mapSize = 200;
let startingChunk = getPlayerStartingChunk();
let macroSize = 320.0;
let chunkSize = 1024.0;

export function noiseMap_macro({ seed = seed }) {
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
        const x = (Math.sin(seed + 1) * 10000) % 1;
        const y = (Math.sin(seed + 2) * 10000) % 1;
        return new Point(x, y);
    }

    let hashedSeed = hashSeed(seed);

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
        noiseFilter.uniforms.seed = [hashedSeed.x, hashedSeed.y];

        // Render the temporary sprite with macroRenderTexture.
        let renderTexture = RenderTexture.create({
            width: tempSprite.width,
            height: tempSprite.height
        });

        app.renderer.render(tempSprite, renderTexture);
        scene.removeChild(tempSprite);

        // Make a new sprite that contains this rendered texture.
        let textureSprite = new Sprite(renderTexture);
        scene.addChild(textureSprite);

        return renderTexture;
    }

    generateMacroTexture(macroShader_color, map, mapScene);
    let macroRenderTexture = generateMacroTexture(macroShader_noiseGradient, app, app.stage);
    macroRenderTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    
    // LOAD CHUNK SHADER
    const chunkFilter = new Filter(vertex, chunkShader);
    let chunkTempSprite = new Sprite(Texture.WHITE);
    chunkTempSprite.width = chunkSize;
    chunkTempSprite.height = chunkSize;
    chunkTempSprite.filterArea = new Rectangle(0, 0, chunkSize, chunkSize);
    app.stage.addChild(chunkTempSprite);
    
    chunkTempSprite.filters = [chunkFilter];
    chunkFilter.uniforms.seed = [hashedSeed.x, hashedSeed.y];
    chunkFilter.uniforms.chunkCoord = [startingChunk.x, startingChunk.y];
    chunkFilter.uniforms.macroSize = macroSize;
    chunkFilter.uniforms.chunkSize = chunkSize;
    chunkFilter.uniforms.macroTexture = macroRenderTexture; 
    chunkFilter.uniforms.deviationFactor = .2;

    // Render the chunk sprite with its own macroRenderTexture.
    let chunkRenderTexture = RenderTexture.create({
        width: chunkTempSprite.width,
        height: chunkTempSprite.height
    });
    chunkRenderTexture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    app.renderer.render(chunkTempSprite, chunkRenderTexture);
    app.stage.removeChild(chunkTempSprite);


    // Make a new sprite that contains this chunk rendered texture.
    let chunkTextureSprite = new Sprite(chunkRenderTexture);
    chunkTextureSprite.x = 0;

    let container = new Container();
    container.addChild(chunkTextureSprite);
    container.scale.set(4);

    // Populate foliage textures.
    let foliage = new Container();
    function createFoliage(x, y, chunkSeed) {
        let randomIndex = 1 + Math.floor(seededRandom(chunkSeed++) * 3);
        let texture = new Sprite(environmentSheets['grass_texture-' + randomIndex]);
        texture.scale.set(1);
        texture.x = x;
        texture.y = y;
        foliage.addChild(texture);
    }

    objectChunkDispertion({ createObjectFn: createFoliage, pushObjectFn: null, objectDensity: 1.2, objectSeed: '123', coordX: foliage.x, coordY: foliage.y });
    let foliageTexture = RenderTexture.create(foliage.width, foliage.height);
    app.renderer.render(foliage, foliageTexture);
    let foliageSprite = new Sprite(foliageTexture);
    container.addChild(foliageSprite);

    // Draw a red square for the chunk's position.
    let redMarker = new Graphics();
    let markerX = (startingChunk.x * 4);
    let markerY = (startingChunk.y * 4);
    redMarker.beginFill(0xFF0000, 0.3); // red color
    redMarker.drawRect(markerX, markerY, 4, 4);
    mapScene.addChild(redMarker);

    return container;
}