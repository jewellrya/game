import {  Graphics, app, Point, Filter, Sprite, RenderTexture, Texture, Rectangle, Container, mapScene, map } from '../../_game.js';
import { getPlayerStartingChunk } from '../utilities/map_utilities.js';
import { objectChunkDispertion, seededRandom } from '../../entities/utilities/entities_utilities.js';
import { environmentSheets } from '../../sheets/environmentSheet.js';
import macroShader from '../../shaders/macroShader.glsl';
import chunkShader from '../../shaders/chunkShader.glsl';

export let seed = 123456789;
export let mapSize = 200;
let startingChunk = getPlayerStartingChunk();

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

    // NEED TO RENDER MACRO TWICE CUZ RENDERERS ARE GUMPY    
    const myFilter2 = new Filter(vertex, macroShader);
    let macroTempSprite2 = new Sprite(Texture.WHITE);
    let macroSize2 = 320.0;
    macroTempSprite2.width = macroSize2;
    macroTempSprite2.height = macroSize2;
    macroTempSprite2.filterArea = new Rectangle(0, 0, macroSize2, macroSize2);
    mapScene.addChild(macroTempSprite2);
    macroTempSprite2.filters = [myFilter2];

    // Setting the seed for the shader
    const hashedSeed2 = hashSeed(seed);
    myFilter2.uniforms.seed = [hashedSeed2.x, hashedSeed2.y];

    // Render the temporary sprite with macroRenderTexture.
    let macroRenderTexture2 = RenderTexture.create({
        width: macroTempSprite2.width,
        height: macroTempSprite2.height
    });

    map.renderer.render(macroTempSprite2, macroRenderTexture2);
    mapScene.removeChild(macroTempSprite2);

    // Make a new sprite that contains this rendered texture.
    let textureSprite2 = new Sprite(macroRenderTexture2);
    mapScene.addChild(textureSprite2);




    // Macro that the other shit based on:
    const myFilter = new Filter(vertex, macroShader);
    let macroTempSprite = new Sprite(Texture.WHITE);
    let macroSize = 320.0;
    macroTempSprite.width = macroSize;
    macroTempSprite.height = macroSize;
    macroTempSprite.filterArea = new Rectangle(0, 0, macroSize, macroSize);
    app.stage.addChild(macroTempSprite);
    macroTempSprite.filters = [myFilter];

    // Setting the seed for the shader
    const hashedSeed = hashSeed(seed);
    myFilter.uniforms.seed = [hashedSeed.x, hashedSeed.y];

    // Render the temporary sprite with macroRenderTexture.
    let macroRenderTexture = RenderTexture.create({
        width: macroTempSprite.width,
        height: macroTempSprite.height
    });

    app.renderer.render(macroTempSprite, macroRenderTexture);
    app.stage.removeChild(macroTempSprite);
    
    // LOAD CHUNK SHADER
    const chunkFilter = new Filter(vertex, chunkShader);
    let chunkTempSprite = new Sprite(Texture.WHITE);
    let chunkSize = 1024.0;
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
    chunkFilter.uniforms.deviationFactor = 0.4;

    // Render the chunk sprite with its own macroRenderTexture.
    let chunkRenderTexture = RenderTexture.create({
        width: chunkTempSprite.width,
        height: chunkTempSprite.height
    });

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
    let markerX = (startingChunk.x);
    let markerY = (startingChunk.y);
    console.log(markerX);
    redMarker.beginFill(0xFF0000); // red color
    redMarker.drawRect(markerX, markerY, 4, 4);
    mapScene.addChild(redMarker);

    return container;
    

    // // Noise JS
    // let graphics = new Graphics();

    // for (let i = 0; i < mapSize; i++) {
    //     for (let j = 0; j < mapSize; j++) {
    //         let value = normalize(getCombinedNoiseValue({ x: i, y: j, seed })) // Normalize value to [0,1]
    //         let color = getColorForMacro(value);

    //         graphics.beginFill(color);
    //         graphics.drawRect(i * chunkSize, j * chunkSize, chunkSize, chunkSize);
    //         graphics.endFill();

    //         graphics.x = 0;
    //         graphics.y = 0;

    //     }
    // }

    // graphics.scale.set(macroMapScale);

    // let initialChunk = generateChunkFromMacro(startingChunk.x, startingChunk.y, seed);
    // let chunkGraphic = drawChunkGraphics(initialChunk);

    

    // return chunkGraphic;
}