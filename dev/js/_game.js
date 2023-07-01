// Player
import { createPlayer, createPlayerArmor } from './player/player.js';
import { playerDynamics, keysDownResetPlayer_listener } from './dynamics/playerDynamics.js';

// Sheets
import { getPlayerSheetsDirs, playerSheets_setup } from './sheets/playerSheets.js';
import { setIconSheet } from './sheets/iconSheet.js';
import { setMiscSheet } from './sheets/miscSheet.js';

// Entities
import { entitiesArray_setup } from './entities/entities.js';

// Enemy
import { createEnemy, enemyAggroListener } from './entities/enemies/rat.js';

// UI
import { ui_design_init } from './ui/ui_design.js';
import { ui_setup } from './ui/ui.js';

// Controls
import { defaultCursor, attackCursor } from './controllers/mouse.js';
import { initiateKeyboard } from './controllers/keyboard.js';

// Misc
import { itemData_init } from './data/itemData.js';
import { getBg, setBg } from './map/bg.js';
import { lootInstance, lootCollide_listener } from './entities/containers/loot.js';

// Aliases
export let Application = PIXI.Application,
    loaderResource = PIXI.LoaderResource,
    loader = PIXI.Loader,
    settings = PIXI.settings,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    AnimatedSprite = PIXI.AnimatedSprite,
    Container = PIXI.Container,
    BitmapText = PIXI.BitmapText,
    Graphics = PIXI.Graphics,
    u = new SpriteUtilities(PIXI);

settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// Capture single click in game loop:
let clickRegistered = false;
export let getClickRegistered = () => clickRegistered;

// Create a Pixi Application
export let app = new Application({
    width: 800,
    height: 500
});

// Set Cursor
app.renderer.plugins.interaction.cursorStyles.default = defaultCursor;
app.renderer.plugins.interaction.cursorStyles.hover = attackCursor;

// Add the canvas that Pixi automatically created for you.
document.getElementById("game").appendChild(app.view);

loaderResource.setExtensionXhrType('fnt', loaderResource.XHR_RESPONSE_TYPE.TEXT);
loader.shared.onProgress.add(loadProgressHandler)
loader.shared
    .add('Visitor', '../../assets/Visitor.fnt')
    .add([
        '../../assets/sprites/icons/spritesheets/icons.json',
        '../../assets/sprites/misc/spritesheets/misc.json',
        '../../assets/sprites/terrain/map.png'
    ].concat(
        getPlayerSheetsDirs()
    )).load(setup);

function loadProgressHandler(loader) {
    // Basis for a loading progress bar.
    console.log('loading...', loader.progress + '%');
}

// Define variables in more than one function
export let gameScene, gameOverScene, messageGameOver;
let id, state;

export let enemies = [];
function setup() {
    console.log('All files loaded.');

    initiateKeyboard();

    // Other texturesheets to move over.
    setIconSheet(resources['../../assets/sprites/icons/spritesheets/icons.json'].textures);
    setMiscSheet(resources['../../assets/sprites/misc/spritesheets/misc.json'].textures);

    // Initialize item data (execute after setIconSheet);
    itemData_init();

    // Create Array of Spritesheets for the Player:
    playerSheets_setup();

    // initialize ui variables
    ui_design_init();

    // Set Player coordinates
    let playerCoordX = 4175;
    let playerCoordY = -500;

    let map = new Sprite(
        PIXI.Loader.shared.resources['../../assets/sprites/terrain/map.png'].texture
    );
    setBg(map);
    let bg = getBg();
    bg.scale.set(4, 4);
    bg.x = 405 - playerCoordX;
    bg.y = -1825 + playerCoordY;
    app.stage.addChild(bg);

    // Main Game Scene
    gameScene = new Container();
    gameScene.render.renderWebGL;
    app.stage.addChild(gameScene);

    // Secondary Game Over Scene
    gameOverScene = new Container();
    gameOverScene.visible = false;
    app.stage.addChild(gameOverScene);

    // Enemy
    let enemy = createEnemy();
    gameScene.addChild(enemy);

    // Player
    keysDownResetPlayer_listener();
    let player = createPlayer();
    gameScene.addChild(player);
    createPlayerArmor();

    // Loot
    let loot1 = lootInstance(550, 180, 'D');
    gameScene.addChild(loot1);

    // Entities (Any object in the stage besides the player)
    entitiesArray_setup();

    // UIs
    let ui = ui_setup();
    app.stage.addChild(ui);

    // Render the Stage
    app.renderer.render(app.stage);

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

    // Enemy Hitbox Listener
    enemyAggroListener();

    // Loot collide Listener
    lootCollide_listener();
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