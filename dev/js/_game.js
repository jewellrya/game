// import { hitTestRectangle } from './module/hit.js';
// import { randomInt, randomIntReverse } from "./module/random.js";
// import createEnemy from './module/enemy.js';

// Player
import { playerStats } from './playerData.js';
import { createPlayer, createPlayerArmor, getPlayer } from './player.js';
import { playerMovement } from './playerMovement.js';

// Sheets
import { playerSheets_setup } from './sheets/playerSheets.js';
import { setIconSheet } from './sheets/iconSheet.js';
import { setMiscSheet } from './sheets/miscSheet.js';

// UI
import { resourceMeters_setup } from './ui/resourceMeters.js';
import { bagButton_setup, bag_setup, bagPopupMenus_setup, bagPopupMenuInteraction, bagPopulateMenus, bagTooltips_setup } from './ui/bag.js';
import { textStyle } from './ui/textStyle.js';
import { character_setup, characterButton_setup, characterPopupMenus_setup, characterPopupMenuInteraction, characterPopulateMenus, characterTooltips_setup } from './ui/character.js';
import { uiData_setup } from './ui/uiDesign.js';

// Controls
import { defaultCursor, attackCursor } from './controls/mouse.js';
import { keysDown, keyboard } from './controls/keyboard.js';

// Misc
import { itemsMap_setup } from './itemMap.js';
import { getBg, setBg } from './background.js';


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

// Create a Pixi Application
export let app = new Application({
    width: 600,
    height: 400
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
        '../../assets/sprites.json',
        '../../assets/sprites/icons.json',
        '../../assets/sprites/misc.json',
        '../../assets/sprites/humanMale/main/humanMale_noArmorNaked.json',
        '../../assets/sprites/humanMale/armor/humanMale_clothChest.json',
        '../../assets/sprites/humanMale/armor/humanMale_clothFeet.json',
        '../../assets/sprites/humanMale/armor/humanMale_clothHands.json',
        '../../assets/sprites/humanMale/armor/humanMale_clothHead.json',
        '../../assets/sprites/humanMale/armor/humanMale_clothLegs.json',
        '../../assets/sprites/humanMale/armor/humanMale_clothShoulders.json',
    ]).load(setup);

function loadProgressHandler(loader) {
    // Basis for a loading progress bar.
    console.log('loading...', loader.progress + '%');
}

// Define variables in more than one function
let gameScene, gameOverScene, messageGameOver;
let id, state;
export let enemies = [];
let numberOfRats;

function setup() {
    console.log('All files loaded.');

    // Other texturesheets to move over.
    let id = resources['../../assets/sprites.json'].textures;

    setIconSheet(resources['../../assets/sprites/icons.json'].textures);
    setMiscSheet(resources['../../assets/sprites/misc.json'].textures);

    // Create an Object to get item data (execute after setIconSheet);
    itemsMap_setup();

    // Create Array of Spritesheets for the Player:
    playerSheets_setup();

    // Main Game Scene
    gameScene = new Container();
    gameScene.render.renderWebGL;
    app.stage.addChild(gameScene);

    // Secondary Game Over Scene
    gameOverScene = new Container();
    gameOverScene.visible = false;
    app.stage.addChild(gameOverScene);

    setBg(new Sprite(id['environment.png']));
    let bg = getBg();
    gameScene.addChild(bg);


    // numberOfRats = 2;
    // let ratContainer = new Container();
    // ratContainer.name = "rats";
    // gameScene.addChild(ratContainer);
    // for (let i = 0; i < numberOfRats; i++) {
    //     let rat = createEnemy(bg, "rat");
    //     enemies.push(rat);
    //     ratContainer.addChild(rat);
    // }

    // UIs
    uiData_setup();

    let resourceMeters = resourceMeters_setup();
    gameScene.addChild(resourceMeters);

    let bagButton = bagButton_setup();
    gameScene.addChild(bagButton);
    let bag = bag_setup();
    gameScene.addChild(bag);

    let characterButton = characterButton_setup();
    gameScene.addChild(characterButton);
    let character = character_setup();
    gameScene.addChild(character);

    let player = createPlayer();

    // Reset player animation with keysDown
    Object.keys(keysDown).map(key => {
        keyboard(key).press = () => {
            getPlayer().gotoAndStop(0);
        }
        keyboard(key).release = () => {
            getPlayer().gotoAndStop(0);
        }
    })

    gameScene.addChild(player);
    createPlayerArmor();

    // Create Popup Menu's Containers;
    let bagPopupMenus = bagPopupMenus_setup();
    gameScene.addChild(bagPopupMenus);
    bagPopulateMenus();
    bagPopupMenuInteraction();
    let bagTooltips = bagTooltips_setup();
    gameScene.addChild(bagTooltips);

    let characterPopupMenus = characterPopupMenus_setup();
    gameScene.addChild(characterPopupMenus);
    characterPopulateMenus();
    characterPopupMenuInteraction();
    let characterTooltips = characterTooltips_setup();
    gameScene.addChild(characterTooltips);

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
    playerMovement();

    // Enemies (disable for now)

    // enemies.forEach(function (enemy) {
    //     enemy.cursor = 'hover';
    //     enemy.interactive = true;
    //     var range = 100;

    //     // If enemy is within range of player's base
    //     if (enemy.x + enemy.width >= player.x - range
    //         && enemy.x <= player.x + player.width + range
    //         && enemy.y + enemy.height >= player.y - range
    //         && enemy.y <= player.y + player.height + range
    //     ) {
    //         if (enemy.x + (enemy.width / 2) < player.x + (player.width / 2)) {
    //             enemy.x += enemy.speed;
    //         }
    //         if (enemy.x + (enemy.width / 2) > player.x + (player.width / 2)) {
    //             enemy.x += -enemy.speed;
    //         }
    //         if (enemy.y + (enemy.height / 2) < player.y + (player.height / 2)) {
    //             enemy.y += enemy.speed;
    //         }
    //         if (enemy.y + (enemy.height / 2) > player.y + (player.height / 2)) {
    //             enemy.y += -enemy.speed;
    //         }
    //     } else {
    //         enemy.x += enemy.speed * enemy.direction;
    //         if (enemy.x >= bg.x + bg.width - enemy.width ||
    //             enemy.x <= bg.x) {
    //             enemy.direction *= -1;
    //         }
    //     }
    // })

    // if (hitTestRectangle(gold, player)) {
    //     ++inventory.currency.gold;
    //     gold.x = randomInt(bg.x, bg.x + bg.width - gold.width);
    //     gold.y = randomInt(bg.y, bg.y + bg.height - gold.height);
    //     bagUiGoldText.text = inventory.currency.gold;
    // }

    // let ratCage = gameScene.getChildByName("rats");
    // for (let i = 0; i < numberOfRats - enemies.length; i++) {
    //     let rat = createEnemy(bg, "rat");
    //     enemies.push(rat);
    //     ratCage.addChild(rat);
    // }
    // enemies.forEach(function (enemy, index) {
    //     if (hitTestRectangle(enemy, player)) {
    //         if (playerStats.health > 0) {
    //             playerStats.health -= enemy.strength;
    //             resourceMeters.types.health.inner.width = playerStats.health * 2 - resourceMeters.innerOffset * 2;
    //         }

    //         if (click['mouse']) {
    //             if (enemy.health > 0) {
    //                 enemy.health -= playerStats.strength;
    //             }
    //             if (enemy.health <= 0) {
    //                 enemies.splice(index, 1);
    //                 enemy.visible = false
    //             }

    //         }
    //     }
    // })
    if (playerStats.health <= 0) {
        state = end;
    }
}

function end() {
    // Game Over Scene
    messageGameOver = new BitmapText("You died.", textStyle);
    messageGameOver.x = app.view.width / 2 - messageGameOver.width / 2;
    messageGameOver.y = app.view.height / 2 - messageGameOver.height / 2;
    gameOverScene.addChild(messageGameOver);

    gameScene.visible = false;
    gameOverScene.visible = true;
}