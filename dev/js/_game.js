// import { hitTestRectangle } from './module/hit.js';
// import { randomInt, randomIntReverse } from "./module/random.js";
// import createEnemy from './module/enemy.js';

import { playerName, playerStats, getInventory, setInventoryCopper, getInventoryItems, setInventoryItem, getEquipped, getEquippedSlot, setEquippedSlot, getEquippedCubby, setEquippedCubby } from './playerData.js';
import { itemsMap, itemsMap_setup } from './itemMap.js';
import { playerSheets, playerSheets_setup, createPlayerSheet, setIdleTexture } from './sheets/playerSheets.js';
import { getIconSheet, setIconSheet } from './sheets/iconSheet.js';
import { getMiscSheet, setMiscSheet } from './sheets/miscSheet.js';
import { keyboard, keysDown } from './controls/keyboard.js';
import { defaultCursor, attackCursor } from './controls/mouse.js';
import { resourceMeters_setup } from './ui/resourceMeters.js';
import { playerMovement } from './playerMovement.js';
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
export let player, playerBase, gold;
export let enemies = [];
let numberOfRats;
let bagUi, characterUi, bagUiGoldText, bagUiSilverText, bagUiCopperText, popupMenus;
let bagUiBg, bagUiMargin, cubbySize;
let playerContainer;

let textStyle = {
    fontName: 'Visitor',
    fontSize: 24,
}

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

    let playerSpriteScale = 2;
    function createPlayer() {
        setIdleTexture(playerSheets.idle_noArmorNaked_DR);
        playerContainer = new Container();
        gameScene.addChild(playerContainer);

        player = new AnimatedSprite(playerSheets.idle_noArmorNaked_DR);
        player.x = (app.view.width - (player.width * playerSpriteScale)) / 2;
        player.y = (app.view.height - (player.height * playerSpriteScale)) / 2;
        player.scale.set(playerSpriteScale);
        player.animationSpeed = .1;
        player.loop = false;

        playerBase = new Sprite(getMiscSheet()['dropShadow.png']);
        playerBase.scale.set(playerSpriteScale * 1.5, playerSpriteScale * 1.5);
        playerBase.x = player.x + (player.width / 2) - 15;
        playerBase.y = player.y + player.height - 80;

        playerContainer.addChild(playerBase);
        playerContainer.addChild(player);

        player.play();
    }

    // Player Armor
    function createPlayerArmor() {
        Object.keys(getEquipped()).map(slot => {
            let equippedItem = getEquippedSlot(slot);
            if (equippedItem.item) {
                createPlayerSheet('humanMale', equippedItem.item);
                equippedItem.animatedSprite = new AnimatedSprite(playerSheets['idle_' + equippedItem.item + '_DR']);
                equippedItem.animatedSprite.x = player.x;
                equippedItem.animatedSprite.y = player.y;
                equippedItem.animatedSprite.scale.set(playerSpriteScale);
                equippedItem.animatedSprite.animationSpeed = player.animationSpeed;
                equippedItem.animatedSprite.loop = false;
                equippedItem.idleTexture = playerSheets['idle_' + equippedItem.item + '_DR'];
                playerContainer.addChild(equippedItem.animatedSprite);
                equippedItem.animatedSprite.play();
            }

        })
    }

    setBg(new Sprite(id['environment.png']));
    let bg = getBg();
    gameScene.addChild(bg);

    let resourceMeters = resourceMeters_setup();
    gameScene.addChild(resourceMeters);

    // gold = new PIXI.AnimatedSprite(sheet.animations["gold"]);
    // gold.scale.set(0.5, 0.5);
    // gold.x = randomInt(bg.x, bg.x + bg.width - gold.width);
    // gold.y = randomInt(bg.y, bg.y + bg.height - gold.height);
    // gold.animationSpeed = 0.1;
    // gold.play();
    // gameScene.addChild(gold);

    // numberOfRats = 2;
    // let ratContainer = new Container();
    // ratContainer.name = "rats";
    // gameScene.addChild(ratContainer);
    // for (let i = 0; i < numberOfRats; i++) {
    //     let rat = createEnemy(bg, "rat");
    //     enemies.push(rat);
    //     ratContainer.addChild(rat);
    // }

    // Reset player animation with keysDown
    Object.keys(keysDown).map(key => {
        keyboard(key).press = () => {
            player.gotoAndStop(0);
        }
        keyboard(key).release = () => {
            player.gotoAndStop(0);
        }
    })

    // UIs -----------------------------------------------------------------------

    popupMenus = new Container();

    // bagIcon UI Button
    let bagIconScale = 1.75;
    let bagIconMargin = 15;
    let bagIcon = new Sprite(getIconSheet()['iconBag.png']);
    bagIcon.scale.set(bagIconScale, bagIconScale);
    bagIcon.x = app.view.width - bagIcon.width - bagIconMargin;
    bagIcon.y = app.view.height - bagIcon.height - bagIconMargin;
    bagIcon.interactive = true;
    gameScene.addChild(bagIcon);

    let uiWindowHeight = 270;
    let uiWindowY = app.view.height - uiWindowHeight - 60;

    // Bag UI Window
    bagUi = new Container();
    bagUiBg = new Graphics();
    bagUiBg.lineStyle(4, 0x000000, .5, 0);
    bagUiBg.beginFill('0x000000', .3);
    bagUiBg.drawRect(0, 0, 168, uiWindowHeight);
    bagUiBg.x = app.view.width - bagUiBg.width - 10;
    bagUiBg.y = uiWindowY;
    bagUi.addChild(bagUiBg);

    let bagUiCurrency = new Container();
    bagUiCurrency.x = bagUiBg.x + 10;
    bagUiCurrency.y = bagUiBg.y + bagUiBg.height - 22;

    // Gold Container for Icon & Amount
    let bagUiCurrencyGold = new Container();
    let bagUiGoldIcon = new Sprite(getIconSheet()['iconGold.png']);
    bagUiGoldIcon.scale.set(.75, .75);
    bagUiCurrencyGold.addChild(bagUiGoldIcon);
    bagUiGoldText = new BitmapText(getInventory().currency.gold.toString(), textStyle);
    bagUiGoldText.x = bagUiGoldIcon.x + 14;
    bagUiGoldText.y = bagUiGoldIcon.y - 3;
    bagUiCurrencyGold.addChild(bagUiGoldText);
    bagUiCurrency.addChild(bagUiCurrencyGold);

    // Silver Container for Icon & Amount - Try PIXI.BitmapText to use bagUiCurrencyGold.width.
    let bagUiCurrencySilver = new Container();
    bagUiCurrencySilver.x = 35;
    let bagUiSilverIcon = new Sprite(getIconSheet()['iconSilver.png']);
    bagUiSilverIcon.scale.set(.75, .75);
    bagUiCurrencySilver.addChild(bagUiSilverIcon);
    bagUiSilverText = new BitmapText(getInventory().currency.silver.toString(), textStyle);
    bagUiSilverText.x = bagUiSilverIcon.x + 14;
    bagUiSilverText.y = bagUiSilverIcon.y - 3;
    bagUiCurrencySilver.addChild(bagUiSilverText);
    bagUiCurrency.addChild(bagUiCurrencySilver);

    // Copper Container for Icon & Amount
    let bagUiCurrencyCopper = new Container();
    bagUiCurrencyCopper.x = 70;
    let bagUiCopperIcon = new Sprite(getIconSheet()['iconCopper.png']);
    bagUiCopperIcon.scale.set(.75, .75);
    bagUiCurrencyCopper.addChild(bagUiCopperIcon);
    bagUiCopperText = new BitmapText(getInventory().currency.copper.toString(), textStyle);
    bagUiCopperText.x = bagUiCopperIcon.x + 14;
    bagUiCopperText.y = bagUiCopperIcon.y - 3;
    bagUiCurrencyCopper.addChild(bagUiCopperText);
    bagUiCurrency.addChild(bagUiCurrencyCopper);

    bagUi.addChild(bagUiCurrency);

    // Bag UI Inventory Cubbies.
    bagUiMargin = 3;
    cubbySize = 36;
    let cubbyRowCount = Math.floor(bagUiBg.height / cubbySize) - 1;
    let cubbiesPerRow = Math.floor(bagUiBg.width / cubbySize);

    // Cubby Row
    let bagCubbyRows = [];
    for (let i = 0; i < cubbyRowCount; i++) {
        bagCubbyRows[i] = new Container();
        let bagCubbyRow = bagCubbyRows[i];
        bagCubbyRow.x = bagUiBg.x + bagUiMargin + bagUiBg.line.width;
        bagCubbyRow.y = bagUiBg.y + bagUiMargin + bagUiBg.line.width;
        bagCubbyRow.width = bagUiBg.width - (bagUiMargin * 2) - (bagUiBg.line.width * 2);
        bagUi.addChild(bagCubbyRow);
    }

    // Individual Cubby
    bagCubbyRows.forEach(function (row, i) {
        for (let j = 0; j < cubbiesPerRow; j++) {
            let bagCubby = new Container();
            bagCubby.x = (bagUiMargin * j) + (cubbySize * j);
            bagCubby.y = (bagUiMargin * i) + (cubbySize * i);
            let bagCubbyBg = new Graphics();
            bagCubbyBg.beginFill('0x000000', .5);
            bagCubbyBg.drawRect(0, 0, cubbySize, cubbySize);
            bagCubbyBg.interactive = true;
            bagCubby.addChild(bagCubbyBg);
            row.addChild(bagCubby);
            getInventoryItems(getInventory().items.push(
                {
                    item: null,
                    cubby: bagCubby,
                }
            ))
        }
    })

    // Add items to cubbies.
    setInventoryItem(1, 'sword1h1');
    setInventoryItem(14, 'clothHead');

    // Add Sprites from Inventory to each Cubby Container.
    getInventoryItems().forEach(function (inventoryItem) {
        let bagUiItemScale = 1.75;
        if (inventoryItem.item) {
            inventoryItem.icon = new Sprite(itemsMap[inventoryItem.item].icon)
            let itemIcon = inventoryItem.icon;
            itemIcon.scale.set(bagUiItemScale);
            itemIcon.x = (cubbySize - itemIcon.width) / 2;
            itemIcon.y = (cubbySize - itemIcon.height) / 2;
            inventoryItem.cubby.addChild(itemIcon);
        }
    })

    let bagUiOpen = false;
    bagIcon.on('click', function () {
        if (!bagUiOpen) {
            bagIcon.texture = getIconSheet()['iconBagSelected.png'];
            bagIcon.x -= bagIconScale;
            bagIcon.y -= bagIconScale;
            gameScene.addChild(bagUi);
            bagUiOpen = true;
        } else {
            bagIcon.texture = getIconSheet()['iconBag.png'];
            bagIcon.x += bagIconScale;
            bagIcon.y += bagIconScale;
            gameScene.removeChild(bagUi);
            bagUiOpen = false;
        }
    })

    let itemMenuWidth = 150;
    let itemMenuHeight = 30;
    getInventoryItems().forEach(function (inventoryItem) {
        let cubby = inventoryItem.cubby;

        // Generate Cubby Menu
        let popupMenu = new Container();
        popupMenu.x = bagUiBg.x + cubby.x + (bagUiMargin * 2) + (cubbySize / 2) - itemMenuWidth;
        popupMenu.y = bagUiBg.y + cubby.y + cubbySize + (bagUiMargin * 2) + 1;
        popupMenu.visible = false;
        popupMenus.addChild(popupMenu);

        let menuItems = [
            {
                label: 'equip',
                menuItem: {},
            },
            {
                label: 'destroy',
                menuItem: {},
            }
        ]

        // Generate Cubby Menu Items
        menuItems.forEach(function (item, i) {
            item.menuItem = new Container();
            item.menuItem.y = (itemMenuHeight * i);
            let itemBg = new Graphics();
            let itemText = new BitmapText(item.label, textStyle);
            itemText.x = 10;
            itemBg.beginFill('0x000000');
            itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            itemBg.interactive = true;
            item.menuItem.addChild(itemBg);
            item.menuItem.addChild(itemText);
            popupMenu.addChild(item.menuItem);
        })
    })

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
        if (getEquippedSlot(slot).item) {
            let cubby = getEquippedSlot(slot).cubby;
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

    createPlayerSheet('humanMale', 'noArmorNaked');
    createPlayer();
    createPlayerArmor();
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