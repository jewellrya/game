import * as PIXI from 'pixi.js';

// Player
import { createPlayer, createPlayerArmor } from './player/player.js';
import { playerStats } from './player/playerData.js';
import { playerDynamics, keysDownResetPlayer_listener } from './dynamics/playerDynamics.js';

// Sheets
import { getPlayerSheetsDirs, playerSheets_setup } from './sheets/playerSheets.js';
import { getenemySheetsDirs, enemySheets_setup } from './sheets/enemySheet.js';
import { setIconSheet } from './sheets/iconSheet.js';
import { setMiscSheet } from './sheets/miscSheet.js';
import { environmentSheets_setup } from './sheets/environmentSheet.js';

// Entities
import { entities_setup, entities_events } from './entities/entities.js';

// UI
import { ui_design_init } from './ui/ui_design.js';
import { ui_setup } from './ui/ui.js';

// Controls
import { defaultCursor, attackCursor } from './controllers/mouse.js';
import { initiateKeyboard } from './controllers/keyboard.js';

// Misc
import { itemData_init } from './items/itemData.js';
import { sortGameScene } from './dynamics/movement/moveEnvironment.js';

// Map
import { generateCoordinates, graphicCoordinates, coordinates, checkPlayerChunk } from './map/utilities/map_utilities.js';
import { generateInitialChunk, seed, setBg } from './map/macro/shaderMaps.js';

// Aliases
export let Application = PIXI.Application,
    loaderResource = PIXI.LoaderResource,
    loader = PIXI.Loader,
    Sprite = PIXI.Sprite,
    Point = PIXI.Point,
    Filter = PIXI.Filter,
    AnimatedSprite = PIXI.AnimatedSprite,
    Container = PIXI.Container,
    BitmapText = PIXI.BitmapText,
    Graphics = PIXI.Graphics,
    Rectangle = PIXI.Rectangle,
    Texture = PIXI.Texture,
    Ticker = PIXI.Ticker,
    RenderTexture = PIXI.RenderTexture,
    settings = PIXI.settings,
    resources = PIXI.Loader.shared.resources,
    utils = PIXI.utils

settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// Capture single click in game loop:
let clickRegistered = false;
export let getClickRegistered = () => clickRegistered;

// Create a Pixi Application
export let app = new Application({
    width: 800,
    height: 500,
    resolution: 1
});

export let map = new Application({
    width: 800,
    height: 320,
    resolution: 1
})

// Set Cursor
app.renderer.plugins.interaction.cursorStyles.default = defaultCursor;
app.renderer.plugins.interaction.cursorStyles.hover = attackCursor;

// Add the canvas that Pixi automatically created for you.
document.getElementById("game").appendChild(app.view);
document.getElementById("map").appendChild(map.view);

loaderResource.setExtensionXhrType('fnt', loaderResource.XHR_RESPONSE_TYPE.TEXT);
loader.shared.onProgress.add(loadProgressHandler)
loader.shared
    .add('Visitor', '../../assets/Visitor.fnt')
    .add([
        '../../assets/sprites/icons/spritesheets/icons.json',
        '../../assets/sprites/misc/spritesheets/misc.json',
        '../../assets/sprites/environment/spritesheets/environment.json',
    ].concat(
        getPlayerSheetsDirs()
    ).concat(
        getenemySheetsDirs()
    )).load(setup);

function loadProgressHandler(loader) {
    // Basis for a loading progress bar.
    console.log('loading...', loader.progress + '%');
}

// Define variables in more than one function
export let gameScene, gameOverScene, messageGameOver, mapScene;
let state;

export let enemies = [];
function setup() {
    console.log('All files loaded.');

    mapScene = new Container();
    map.stage.addChild(mapScene);

    initiateKeyboard();

    // Icon & Misc texture sheet
    setIconSheet(resources['../../assets/sprites/icons/spritesheets/icons.json'].textures);
    setMiscSheet(resources['../../assets/sprites/misc/spritesheets/misc.json'].textures);
    environmentSheets_setup();

    // Initialize item data (execute after setIconSheet);
    itemData_init();

    // Create Array of Spritesheets for the Player:
    playerSheets_setup();

    // Create Array of Spritesheets for Entities:
    enemySheets_setup();

    // initialize ui variables
    ui_design_init();

    let bg = generateInitialChunk({ seed: seed });
    generateCoordinates();
    bg.x = -coordinates.player.chunk.x;
    bg.y = -coordinates.player.chunk.y;
    setBg(bg);
    app.stage.addChild(bg);

    let BitmapTextCoordinates = graphicCoordinates();
    mapScene.addChild(BitmapTextCoordinates);

    // Main Game Scene
    gameScene = new Container();
    gameScene.render.renderWebGL;
    app.stage.addChild(gameScene);

    // Secondary Game Over Scene
    gameOverScene = new Container();
    gameOverScene.visible = false;
    app.stage.addChild(gameOverScene);

    // Player
    keysDownResetPlayer_listener();
    let player = createPlayer();
    gameScene.addChild(player);
    createPlayerArmor();

    // Entities
    entities_setup();

    // Sort Game Scene Objects for Initial Render.
    sortGameScene();

    // UIs
    let ui = ui_setup();
    app.stage.addChild(ui);

    // Set the game state
    state = play;

    // Start the game loop
    app.ticker.add(delta => gameLoop(delta));
}

// Game Loop -----------------------------------------------------------------------
function gameLoop(delta) {

    // update the current game state:
    state(delta);
}

function play() {
    // Player Movement / Controls
    playerDynamics();

    // Interaction events from entities.
    entities_events();

    if (playerStats.health <= 0) {
        state = end;
    }
}

function end() {
    // Game Over Scene
    messageGameOver = new BitmapText("You died.", uiStyle.text);
    messageGameOver.x = app.view.width / 2 - messageGameOver.width / 2;
    messageGameOver.y = app.view.height / 2 - messageGameOver.height / 2;
    gameOverScene.addChild(messageGameOver);

    gameScene.visible = false;
    gameOverScene.visible = true;
}