// import { hitTestRectangle } from './module/hit.js';
// import { randomInt, randomIntReverse } from "./module/random.js";
// import createEnemy from './module/enemy.js';

// Player
import { playerName, playerStats, getEquipped, getEquippedSlot, getEquippedCubby, setEquippedCubby } from './playerData.js';
import { createPlayer, createPlayerArmor, getPlayer } from './player.js';
import { playerMovement } from './playerMovement.js';

// Sheets
import { playerSheets_setup, createPlayerSheet } from './sheets/playerSheets.js';
import { getIconSheet, setIconSheet } from './sheets/iconSheet.js';
import { setMiscSheet } from './sheets/miscSheet.js';

// UI
import { resourceMeters_setup } from './ui/resourceMeters.js';
import { bagButton_setup, bag_setup, inventoryCubbyMenus, inventoryCubbyMenuFunctions, inventoryOccupiedCubbies } from './ui/bag.js';
import { textStyle } from './ui/textStyle.js';
import { getPopupMenus, popupMenus_setup } from './ui/popupMenus.js';

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
let characterUi;

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

    popupMenus_setup();

    let resourceMeters = resourceMeters_setup();
    gameScene.addChild(resourceMeters);

    // numberOfRats = 2;
    // let ratContainer = new Container();
    // ratContainer.name = "rats";
    // gameScene.addChild(ratContainer);
    // for (let i = 0; i < numberOfRats; i++) {
    //     let rat = createEnemy(bg, "rat");
    //     enemies.push(rat);
    //     ratContainer.addChild(rat);
    // }

    // UIs -----------------------------------------------------------------------

    let bagButton = bagButton_setup();
    gameScene.addChild(bagButton);
    let bag = bag_setup();
    gameScene.addChild(bag);
    inventoryCubbyMenus();
    inventoryOccupiedCubbies();
    inventoryCubbyMenuFunctions();

    let uiWindowHeight = 270;
    let uiWindowY = app.view.height - uiWindowHeight - 60;
    let bagIconScale = 1.75;
    let cubbySize = 35;

    // characterIcon UI Button
    let characterIconScale = 1.75;
    let characterIconMargin = 15;
    let characterIcon = new Sprite(getIconSheet()['iconCharacter.png']);
    characterIcon.scale.set(characterIconScale, characterIconScale);
    characterIcon.x = characterIconMargin;
    characterIcon.y = app.view.height - characterIcon.height - characterIconMargin;
    characterIcon.interactive = true;
    gameScene.addChild(characterIcon);

    let characterUiMargin = 3;

    // Character UI Window
    characterUi = new Container();
    let characterUiBg = new Graphics();
    characterUiBg.lineStyle(4, 0x000000, .5, 0);
    characterUiBg.beginFill('0x000000', .3);
    characterUiBg.drawRect(0, 0, 250, uiWindowHeight);
    characterUiBg.x = 10;
    characterUiBg.y = uiWindowY;
    characterUi.addChild(characterUiBg);

    // Charater Name plate at the top of the Character UI
    let characterUiNamePlate = new Container();
    characterUiNamePlate.x = characterUiBg.x;
    characterUiNamePlate.y = characterUiBg.y;
    let characterUiNamePlateBg = new Graphics();
    characterUiNamePlateBg.beginFill('0x000000');
    characterUiNamePlateBg.drawRect(0, 0, characterUiBg.width, 30);
    characterUiNamePlate.addChild(characterUiNamePlateBg);
    let characterUiNamePlateText = new BitmapText(playerName, textStyle);
    characterUiNamePlateText.x = 10;
    characterUiNamePlateText.y = 7;
    characterUiNamePlate.addChild(characterUiNamePlateText);
    characterUi.addChild(characterUiNamePlate);

    // Section that shows player stats
    let characterUiStats = new Container();
    characterUiStats.x = characterUiBg.x + 7;
    characterUiStats.y = characterUiBg.y + characterUiNamePlateBg.height + characterUiMargin;
    let characterUiStatsBg = new Graphics();
    characterUiStatsBg.beginFill('0x000000', .5);
    characterUiStatsBg.drawRect(0, 0, 85, 175);
    characterUiStats.addChild(characterUiStatsBg);
    Object.keys(playerStats).map(function (stat, i) {
        if (i <= 6) {
            let statCount = new Container();
            statCount.x = 10;
            statCount.y = (characterUiStatsBg.height / 6) + (15 * i);
            let label = new BitmapText(stat.slice(0, 3), textStyle);
            statCount.addChild(label);
            let amount = new BitmapText(playerStats[stat].toString(), textStyle);
            amount.x = 40;
            statCount.addChild(amount);
            characterUiStats.addChild(statCount);
        }
    })
    characterUi.addChild(characterUiStats);
    let characterUiArmor = new Container();
    characterUiArmor.x = characterUiStats.x + characterUiStatsBg.width + characterUiMargin;
    characterUiArmor.y = characterUiStats.y;

    // Generate Cubbies for Equipped Items
    function createEquippedCubby(slot, defaultSprite, x, y) {
        setEquippedCubby(slot, new Container());
        let cubby = getEquippedCubby(slot);

        cubby.x = x + ((characterUiBg.width - characterUiStatsBg.width - (characterUiBg.line.width * 2) - ((cubbySize * 2) + (characterUiMargin * 4))) / 2);
        cubby.y = y + characterUiStatsBg.height - (characterUiBg.line.width * 2) - (((cubbySize * 4) + (characterUiMargin * 4)));
        let cubbyBg = new Graphics();
        cubbyBg.beginFill('0x000000', .5);
        cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
        cubby.addChild(cubbyBg);
        let cubbyDefaultIcon = new Sprite(getIconSheet()[defaultSprite]);
        cubbyDefaultIcon.scale.set(1.5, 1.5);
        cubbyDefaultIcon.x = ((cubby.width - cubbyDefaultIcon.width) / 2);
        cubbyDefaultIcon.y = ((cubby.height - cubbyDefaultIcon.height) / 2);
        cubby.addChild(cubbyDefaultIcon);
        characterUiArmor.addChild(cubby);
    }

    createEquippedCubby('head', 'iconHead.png', 0, 0);
    createEquippedCubby('shoulders', 'iconShoulders.png', cubbySize + characterUiMargin, 0);
    createEquippedCubby('chest', 'iconChest.png', 0, cubbySize + characterUiMargin);
    createEquippedCubby('hands', 'iconHands.png', cubbySize + characterUiMargin, cubbySize + characterUiMargin);
    createEquippedCubby('legs', 'iconLegs.png', 0, (cubbySize + 3) * 2);
    createEquippedCubby('feet', 'iconFeet.png', cubbySize + characterUiMargin, (cubbySize + characterUiMargin) * 2);
    createEquippedCubby('rightHand', 'iconWeapon.png', (-cubbySize / 2), (cubbySize + characterUiMargin) * 3);
    createEquippedCubby('leftHand', 'iconShield.png', (-cubbySize / 2) + cubbySize + characterUiMargin, (cubbySize + characterUiMargin) * 3);
    createEquippedCubby('resourceItem', 'iconArrow.png', (-cubbySize / 2) + ((cubbySize + characterUiMargin) * 2), (cubbySize + characterUiMargin) * 3);

    characterUi.addChild(characterUiArmor);

    let characterUiExtra = new Container();
    characterUiExtra.x = characterUiStats.x;
    characterUiExtra.y = (characterUiStats.y + characterUiStatsBg.height + characterUiMargin);
    let characterUiExtraBg = new Graphics();
    characterUiExtraBg.beginFill('0x000000', .5);
    characterUiExtraBg.drawRect(0, 0, characterUiBg.width - (characterUiMargin * 2) - (characterUiBg.line.width * 2), characterUiBg.height - characterUiStatsBg.height - characterUiNamePlateBg.height - (characterUiMargin * 2) - (characterUiBg.line.width * 2));
    characterUiExtra.addChild(characterUiExtraBg);
    characterUi.addChild(characterUiExtra);

    // Populate Equipped Items Cubbies
    Object.keys(getEquipped()).map(function (slot) {
        let equippedObject = getEquippedSlot(slot);
        let cubby = getEquippedCubby(slot);
        if (equippedObject.item) {
            cubby.removeChild(cubby.children[1]);
            let sprite = new Sprite(getIconSheet()['icon' + getEquippedSlot(slot).item.replace(/^(.)/, s => s.toUpperCase()) + '.png']);
            sprite.scale.set(bagIconScale, bagIconScale);
            sprite.x = ((cubby.width - sprite.width) / 2);
            sprite.y = ((cubby.height - sprite.height) / 2);
            cubby.addChild(sprite);
        }
    })

    // Opening and Closing Character UI
    let characterUiOpen = false;
    characterIcon.on('click', function () {
        if (!characterUiOpen) {
            characterIcon.texture = getIconSheet()['iconCharacterSelected.png'];
            characterIcon.x -= characterIconScale;
            characterIcon.y -= characterIconScale;
            gameScene.addChild(characterUi);
            characterUiOpen = true;
        } else {
            characterIcon.texture = getIconSheet()['iconCharacter.png'];
            characterIcon.x += characterIconScale;
            characterIcon.y += characterIconScale;
            gameScene.removeChild(characterUi);
            characterUiOpen = false;
        }
    })



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

    // Create PopupMenus Container;
    let popupMenus = getPopupMenus();
    gameScene.addChild(popupMenus);

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
    // Create an array of objects that will move with the environment

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