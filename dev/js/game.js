// TODO: Health bar above enemies
// TODO: Melee weapon mechanic
// TODO: Ranged mechanic for magic & ranged weapons
// TODO: Animate when taking damage
// TODO: Animations for attacks
// TODO: Inventory and item equip.
// TODO: Create sprites for equipment & cosmetics that overlay the player.
// TODO: Change position of sprites rendering

import { hitTestRectangle } from './module/hit.js';
import { randomInt, randomIntReverse } from "./module/random.js";
import keyboard from './module/keyboard.js';
import createEnemy from './module/enemy.js';

// Aliases
let Application = PIXI.Application,
    loader = PIXI.Loader,
    TextureCache = PIXI.utils.TextureCache,
    resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite,
    AnimatedSprite = PIXI.AnimatedSprite,
    Container = PIXI.Container,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    Graphics = PIXI.Graphics,
    u = new SpriteUtilities(PIXI);

// Create a Pixi Application
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

let app = new Application({
    width: 600,
    height: 400
});

// Add the canvas that Pixi automatically created for you.
document.getElementById("game").appendChild(app.view);

loader.shared
    .add('../../assets/sprites.json')
    .add('../../assets/sprites/humanMale/main/humanMale_noArmorNaked.json')
    .add('../../assets/sprites/humanMale/armor/humanMale_clothChest.json')
    .add('../../assets/sprites/icons.json')
    .load(setup);

// Define variables in more than one function
let gameScene, gameOverScene, messageGameOver;
let id, state, sheet;
let sheet_humanMale_noArmorNaked, sheet_humanMale_clothChest;
let sheet_icons;
let player, playerBase, playerChest, bg, gold;
let enemies = [];
let numberOfRats;
let itemsMap;
let fontStyle, bagUi, characterUi, bagUiGoldText, bagUiSilverText, bagUiCopperText, popupMenus;
let playerContainer, playerStats, inventory;
let bagCubbies = [];
let equipped;

let resourceMeters = {
    types: {
        health: {},
        fatigue: {},
        soul: {},
    }
};

let playerSheet = {};
let playerIdleTexture, playerChestIdleTexture;

// Cursor
const defaultIcon = "url('../../assets/cursor.png'),auto";
const hoverIcon = "url('../../assets/cursorAttack.png'),auto";
app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;

// keyboard event handlers
window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);
window.addEventListener('mousedown', mouseDown);
window.addEventListener('mouseup', mouseUp);
window.addEventListener('mousemove', mouseMove);

let controls = {
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ShiftLeft: false,
};

let keys = {};
let click = {};
let cursor = {
    x: 0,
    y: 0
}

function keysDown(e) {
    keys[e.keyCode] = true;
}

function keysUp(e) {
    keys[e.keyCode] = false;
}

function mouseDown(e) {
    click['mouse'] = true;
}

function mouseUp(e) {
    click['mouse'] = false;
}

function mouseMove(e) {
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
}

playerStats = {

    // Primary Stats
    strength: 10, // Affects physical weapon damage, weapon fatigue cost.
    endurance: 10, // Affects damage resistance, fatigue amount.
    vitality: 10, // Affects health amount, and health regen.
    dexterity: 10, // Affects walking speed, weapon speed, magic speed, and fatigue regen.
    intelligence: 10, // Affects magic damage and magic cost.
    wisdom: 10, // Affects soul amount and soul regen.
    charisma: 10, // Dialogue options.
}

function setup() {

    // Other texturesheets to move over.
    sheet = PIXI.Loader.shared.resources["../../assets/sprites.json"].spritesheet;
    id = PIXI.Loader.shared.resources['../../assets/sprites.json'].textures;

    // Player Spritesheets
    sheet_humanMale_noArmorNaked = PIXI.Loader.shared.resources["../../assets/sprites/humanMale/main/humanMale_noArmorNaked.json"].spritesheet;
    sheet_humanMale_clothChest = PIXI.Loader.shared.resources["../../assets/sprites/humanMale/armor/humanMale_clothChest.json"].spritesheet;

    // Icon Spritesheets
    sheet_icons = PIXI.Loader.shared.resources['../../assets/sprites/icons.json'].textures;

    // Main Game Scene
    gameScene = new Container();
    gameScene.render.renderWebGL;
    app.stage.addChild(gameScene);

    // Secondary Game Over Scene
    gameOverScene = new Container();
    gameOverScene.visible = false;
    app.stage.addChild(gameOverScene);

    // Resources
    playerStats.health = playerStats.vitality;
    playerStats.fatigue = playerStats.endurance;
    playerStats.soul = playerStats.wisdom;

    // Secondary Stats
    playerStats.fatigueCost = .05;
    playerStats.fatigueRegen = playerStats.dexterity / 300;
    playerStats.speed = function () {
        if (controls.ShiftLeft && playerStats.fatigue > 0) {
            return (1 + playerStats.dexterity / 7);
        } else {
            return 1 + playerStats.dexterity / 30;
        }
    }

    fontStyle = new TextStyle({
        fontFamily: 'Visitor',
        fontSize: 20,
        fill: 'white'
    })

    function stats(str, end, vit, dex, int, wis, cha) {
        return {
            strength: str,
            endurance: end,
            vitality: vit,
            dexterity: dex,
            intelligence: int,
            wisdom: wis,
            charisma: cha,
        }
    }

    itemsMap = {
        clothChest: {
            icon: sheet_icons['iconClothChest.png'],
            type: 'armor',
            equipable: true,
            slot: 'chest',
            stats: stats(0, 0, 0, 0, 1, 1, 0),
            armor: 3,
        },
        clothFeet: {
            icon: sheet_icons['iconClothFeet.png'],
            type: 'armor',
            equipable: true,
            slot: 'feet',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 1,
        },
        clothHands: {
            icon: sheet_icons['iconClothHands.png'],
            type: 'armor',
            equipable: true,
            slot: 'hands',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 1,
        },
        clothHead: {
            icon: sheet_icons['iconClothHead.png'],
            type: 'armor',
            equipable: true,
            slot: 'head',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 2,
        },
        clothLegs: {
            icon: sheet_icons['iconClothLegs.png'],
            type: 'armor',
            equipable: true,
            slot: 'legs',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 3,
        },
        clothShoulders: {
            icon: sheet_icons['iconClothShoulders.png'],
            type: 'armor',
            equipable: true,
            slot: 'shoulders',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 2,
        },
        sword1h1: {
            icon: sheet_icons['iconSword1h1.png'],
            type: 'weapon',
            equipable: true,
            slot: 'rightHand',
            stats: stats(2, 0, 0, 0, 0, 0, 0),
        },
        shield1: {
            icon: sheet_icons['iconShield1.png'],
            type: 'shield',
            equipable: true,
            slot: 'leftHand',
            stats: stats(1, 3, 1, 0, 0, 0, 0),
            armor: 5,
        },
    }

    inventory = {
        currency: {
            gold: 0,
            silver: 0,
            copper: 0,
        },
        items: ['clothFeet', 'clothHands', 'clothHead', 'clothLegs', 'clothShoulders', 'sword1h1'],
    }

    equipped = {
        head: null,
        shoulders: null,
        chest: 'clothChest',
        hands: null,
        legs: null,
        feet: null,
        neck: null,
        ring1: null,
        ring2: null,
        rightHand: null,
        leftHand: null,
        resourceItem: null,
    }

    function createPlayerSheet() {
        // Populate playerSheet array with spritesheet animations
        function anim(name, direction) {
            playerSheet[name + '_noArmorNaked_' + direction] = sheet_humanMale_noArmorNaked.animations[name + '-noArmorNaked-' + direction];
            playerSheet[name + '_clothChest_' + direction] = sheet_humanMale_clothChest.animations[name + '-clothChest-' + direction];
        }

        let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];
        directions.forEach(function (direction) {
            anim('idle', direction);
            anim('walking', direction);
            anim('running', direction);
        })
    }

    function createPlayer() {
        let playerSpriteScale = 2;
        playerContainer = new Container();
        gameScene.addChild(playerContainer);

        player = new AnimatedSprite(playerSheet.idle_noArmorNaked_DR);
        player.x = (app.view.width - (player.width * playerSpriteScale)) / 2;
        player.y = (app.view.height - (player.height * playerSpriteScale)) / 2;
        player.scale.set(playerSpriteScale);
        player.animationSpeed = .1;
        player.loop = false;

        playerChest = new AnimatedSprite(playerSheet.idle_clothChest_DR);
        playerChest.x = player.x;
        playerChest.y = player.y;
        playerChest.scale.set(playerSpriteScale);
        playerChest.animationSpeed = player.animationSpeed;
        playerChest.loop = false;

        let blurFilter = new PIXI.filters.BlurFilter(10);
        playerBase = new Graphics();
        playerBase.beginFill('0x000000', .2);
        playerBase.drawCircle(0, 0, 30);
        playerBase.scale.set(1, .75);
        playerBase.filters = [blurFilter];
        playerBase.x = player.x + (player.width / 2) + 5;
        playerBase.y = player.y + player.height - 65;

        playerContainer.addChild(playerBase);
        playerContainer.addChild(player);
        playerContainer.addChild(playerChest);
        player.play();
        playerChest.play();
    }

    // Player Armor

    bg = new Sprite(id['environment.png']);
    gameScene.addChild(bg);

    gold = new PIXI.AnimatedSprite(sheet.animations["gold"]);
    gold.scale.set(0.5, 0.5);
    gold.x = randomInt(bg.x, bg.x + bg.width - gold.width);
    gold.y = randomInt(bg.y, bg.y + bg.height - gold.height);
    gold.animationSpeed = 0.1;
    gold.play();
    gameScene.addChild(gold);

    // numberOfRats = 2;
    // let ratContainer = new Container();
    // ratContainer.name = "rats";
    // gameScene.addChild(ratContainer);
    // for (let i = 0; i < numberOfRats; i++) {
    //     let rat = createEnemy(bg, "rat");
    //     enemies.push(rat);
    //     ratContainer.addChild(rat);
    // }

    // Health, Fatigue, Soul -----------------------------------------------------------------------

    resourceMeters.y = 16;
    resourceMeters.margin = 4;
    resourceMeters.height = 5;
    resourceMeters.innerOffset = 0;

    function drawResourceMeter(resourceName, color) {
        resourceMeters.types[resourceName] = {};
        let meter = resourceMeters.types[resourceName];

        meter.outer = new Graphics();
        meter.outer.beginFill('0x000000', .5);
        meter.outer.drawRect(0, 0, playerStats[resourceName] * 2, resourceMeters.height);
        gameScene.addChild(meter.outer);

        meter.inner = new Graphics();
        meter.inner.beginFill(color);
        meter.inner.drawRect(0, 0, playerStats[resourceName] * 2 - resourceMeters.innerOffset * 2, resourceMeters.height - resourceMeters.innerOffset * 2);
        meter.inner.width = playerStats[resourceName] * 2 - resourceMeters.innerOffset * 2;
        meter.inner.height = resourceMeters.height - resourceMeters.innerOffset * 2;
        meter.inner.endFill();
        gameScene.addChild(meter.inner);
    }

    drawResourceMeter('soul', '0x00d9ff');
    drawResourceMeter('fatigue', '0xffff00');
    drawResourceMeter('health', '0xff0000');

    resourceMeters.types.soul.outer.y = app.view.height - resourceMeters.types.soul.outer.height - resourceMeters.y;
    resourceMeters.types.soul.inner.y = resourceMeters.types.soul.outer.y + resourceMeters.innerOffset;
    resourceMeters.types.fatigue.outer.y = resourceMeters.types.soul.outer.y - resourceMeters.types.fatigue.outer.height - resourceMeters.margin;
    resourceMeters.types.fatigue.inner.y = resourceMeters.types.fatigue.outer.y + resourceMeters.innerOffset;
    resourceMeters.types.health.outer.y = resourceMeters.types.fatigue.outer.y - resourceMeters.types.health.outer.height - resourceMeters.margin;
    resourceMeters.types.health.inner.y = resourceMeters.types.health.outer.y + resourceMeters.innerOffset;
    resourceMeters.x = Math.min((app.view.width - resourceMeters.types.fatigue.outer.width) / 2, (app.view.width - resourceMeters.types.health.outer.width) / 2, (app.view.width - resourceMeters.types.soul.outer.width) / 2);

    function calcResourceX(width) {
        let biggestResourceWidth = Math.max(resourceMeters.types.fatigue.outer.width, resourceMeters.types.soul.outer.width, resourceMeters.types.health.outer.width);
        if (width === biggestResourceWidth) {
            return resourceMeters.x;
        } else {
            return resourceMeters.x + ((biggestResourceWidth - width) / 2);
        }
    }

    Object.keys(resourceMeters.types).map(type => {
        resourceMeters.types[type].outer.x = calcResourceX(resourceMeters.types[type].outer.width);
        resourceMeters.types[type].inner.x = calcResourceX(resourceMeters.types[type].inner.width);
    });

    // Reset player animation with controls
    Object.keys(controls).map(key => {
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
    let bagIcon = new Sprite(sheet_icons['iconBag.png']);
    bagIcon.scale.set(bagIconScale, bagIconScale);
    bagIcon.x = app.view.width - bagIcon.width - bagIconMargin;
    bagIcon.y = app.view.height - bagIcon.height - bagIconMargin;
    bagIcon.interactive = true;
    gameScene.addChild(bagIcon);

    // Bag UI Window
    bagUi = new Container();
    let bagUiBg = new Graphics();
    bagUiBg.lineStyle(4, 0x000000, .5, 0);
    bagUiBg.beginFill('0x000000', .3);
    bagUiBg.drawRect(0, 0, 168, 270);
    bagUiBg.x = app.view.width - bagUiBg.width - 10;
    bagUiBg.y = app.view.height - bagUiBg.height - 60;
    bagUi.addChild(bagUiBg);

    let bagUiCurrency = new Container();
    bagUiCurrency.x = bagUiBg.x + 10;
    bagUiCurrency.y = bagUiBg.y + bagUiBg.height - 22;

    // Gold Container for Icon & Amount
    let bagUiCurrencyGold = new Container();
    let bagUiGoldIcon = new Sprite(sheet_icons['iconGold.png']);
    bagUiGoldIcon.scale.set(.75, .75);
    bagUiCurrencyGold.addChild(bagUiGoldIcon);
    bagUiGoldText = new Text(inventory.currency.gold, fontStyle);
    bagUiGoldText.x = bagUiGoldIcon.x + 14;
    bagUiGoldText.y = bagUiGoldIcon.y - 10;
    bagUiCurrencyGold.addChild(bagUiGoldText);
    bagUiCurrency.addChild(bagUiCurrencyGold);

    // Silver Container for Icon & Amount - Try PIXI.BitmapText to use bagUiCurrencyGold.width.
    let bagUiCurrencySilver = new Container();
    bagUiCurrencySilver.x = 35;
    let bagUiSilverIcon = new Sprite(sheet_icons['iconSilver.png']);
    bagUiSilverIcon.scale.set(.75, .75);
    bagUiCurrencySilver.addChild(bagUiSilverIcon);
    bagUiSilverText = new Text(inventory.currency.silver, fontStyle);
    bagUiSilverText.x = bagUiSilverIcon.x + 14;
    bagUiSilverText.y = bagUiSilverIcon.y - 10;
    bagUiCurrencySilver.addChild(bagUiSilverText);
    bagUiCurrency.addChild(bagUiCurrencySilver);

    // Copper Container for Icon & Amount
    let bagUiCurrencyCopper = new Container();
    bagUiCurrencyCopper.x = 70;
    let bagUiCopperIcon = new Sprite(sheet_icons['iconCopper.png']);
    bagUiCopperIcon.scale.set(.75, .75);
    bagUiCurrencyCopper.addChild(bagUiCopperIcon);
    bagUiCopperText = new Text(inventory.currency.copper, fontStyle);
    bagUiCopperText.x = bagUiCopperIcon.x + 14;
    bagUiCopperText.y = bagUiCopperIcon.y - 10;
    bagUiCurrencyCopper.addChild(bagUiCopperText);
    bagUiCurrency.addChild(bagUiCurrencyCopper);

    bagUi.addChild(bagUiCurrency);

    // Bag UI Inventory Cubbies.
    let bagUiMargin = 3;
    let cubbySize = 36;
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
            bagCubbies.push(
                {
                    cubby: bagCubby,
                    item: null,
                }
            );
        }
    })

    // Add Sprites from Inventory to each Cubby Container.
    inventory.items.forEach(function (item, i) {
        let bagUiItemScale = 1.5;
        bagCubbies[i].item = item;
        let itemIcon = new Sprite(itemsMap[item].icon);
        itemIcon.scale.set(bagUiItemScale);
        itemIcon.x = (cubbySize - itemIcon.width) / 2;
        itemIcon.y = (cubbySize - itemIcon.height) / 2;
        bagCubbies[i].cubby.addChild(itemIcon);
    })

    let itemMenuWidth = 150;
    let itemMenuHeight = 30;
    bagCubbies.forEach(function (cubbyObject) {
        let cubby = cubbyObject.cubby;
        let cubbyItem = cubbyObject.item;
        let cubbyBg = cubby.children[0];

        // Generate Cubby Menu
        let itemMenuOpen = false;
        let popupMenu = new Container();
        popupMenu.x = bagUiBg.x + cubby.x + (bagUiMargin * 2) + (cubbySize / 2) - itemMenuWidth;
        popupMenu.y = bagUiBg.y + cubby.y + cubbySize + (bagUiMargin * 2) + 1;

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
            let itemText = new Text(item.label, fontStyle);
            itemText.x = 10;
            itemBg.beginFill('0x000000');
            itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            itemBg.interactive = true;
            itemBg.on('mouseover', function () {
                itemBg.clear();
                itemBg.beginFill('0x7a7a7a');
                itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            })
            itemBg.on('mouseout', function () {
                itemBg.clear();
                itemBg.beginFill('0x000000');
                itemBg.drawRect(0, 0, itemMenuWidth, itemMenuHeight);
            })
            item.menuItem.addChild(itemBg);
            item.menuItem.addChild(itemText);
            popupMenu.addChild(item.menuItem);
        })

        // Equip
        menuItems[0].menuItem.children[0].on('click', function () {
            console.log(cubbyItem);
            // equip item
            // delete from bags
            let itemSlotType = itemsMap[cubbyItem].slot;
            equipped[itemSlotType] = cubbyItem;
            console.log(equipped);
            itemMenuOpen = false;
            cubbyBg.clear();
            cubbyBg.beginFill('0x000000', .5);
            cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
            gameScene.removeChild(popupMenu);
        })

        // Destroy
        menuItems[1].menuItem.children[0].on('click', function () {
            // delete from bags ----- NEED UPDATE() ?
            // cubbyItem = null;
            // inventory.items.pop();
            // cubby.removeChild(cubby.children[1]);
            itemMenuOpen = false;
            cubbyBg.clear();
            cubbyBg.beginFill('0x000000', .5);
            cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
            gameScene.removeChild(popupMenu);
        })

        if (cubbyItem) {
            cubbyBg.on('mouseover', function () {
                if (!itemMenuOpen) {
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x7a7a7a');
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                }
            });
            cubbyBg.on('mouseout', function () {
                if (!itemMenuOpen) {
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x000000', .5);
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                }
            })

            // Figure out click outside of 
            cubbyBg.on('click', function () {
                if (!itemMenuOpen) {
                    itemMenuOpen = true;
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x00d9ff');
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                    gameScene.addChild(popupMenu);
                } else {
                    itemMenuOpen = false;
                    cubbyBg.clear();
                    cubbyBg.beginFill('0x7a7a7a');
                    cubbyBg.drawRect(0, 0, cubbySize, cubbySize);
                    gameScene.removeChild(popupMenu);
                }
            })
        }
    })

    let bagUiOpen = false;
    bagIcon.on('click', function () {
        if (!bagUiOpen) {
            bagIcon.texture = sheet_icons['iconBagSelected.png'];
            bagIcon.x -= bagIconScale;
            bagIcon.y -= bagIconScale;
            gameScene.addChild(bagUi);
            bagUiOpen = true;
        } else {
            bagIcon.texture = sheet_icons['iconBag.png'];
            bagIcon.x += bagIconScale;
            bagIcon.y += bagIconScale;
            gameScene.removeChild(bagUi);
            bagUiOpen = false;
        }
    })

    // characterIcon UI Button
    let characterIconScale = 1.75;
    let characterIconMargin = 15;
    let characterIcon = new Sprite(sheet_icons['iconCharacter.png']);
    characterIcon.scale.set(characterIconScale, characterIconScale);
    characterIcon.x = characterIconMargin;
    characterIcon.y = app.view.height - characterIcon.height - characterIconMargin;
    characterIcon.interactive = true;
    gameScene.addChild(characterIcon);

    // Character UI Window
    characterUi = new Container();
    let characterUiBg = new Graphics();
    characterUiBg.beginFill('0x000000', .5);
    characterUiBg.drawRect(0, 0, 200, 200);
    characterUiBg.x = 10;
    characterUiBg.y = app.view.height - characterUiBg.height - 60;
    characterUi.addChild(characterUiBg);

    Object.keys(playerStats).map(function (stat, i) {
        if (i <= 6) {
            let text = new Text(stat + ': ' + playerStats[stat], fontStyle);
            text.x = characterUiBg.x + 10;
            text.y = characterUiBg.y + 10 + (20 * i);
            characterUi.addChild(text);
        }
    })

    let characterUiOpen = false;
    characterIcon.on('click', function () {
        if (!characterUiOpen) {
            characterIcon.texture = sheet_icons['iconCharacterSelected.png'];
            characterIcon.x -= characterIconScale;
            characterIcon.y -= characterIconScale;
            gameScene.addChild(characterUi);
            characterUiOpen = true;
        } else {
            characterIcon.texture = sheet_icons['iconCharacter.png'];
            characterIcon.x += characterIconScale;
            characterIcon.y += characterIconScale;
            gameScene.removeChild(characterUi);
            characterUiOpen = false;
        }
    })

    state = play;
    createPlayerSheet();
    playerIdleTexture = playerSheet.idle_noArmorNaked_DR;
    playerChestIdleTexture = playerSheet.idle_clothChest_DR;
    createPlayer();

    app.ticker.add(delta => gameLoop(delta));
}

// Game Loop -----------------------------------------------------------------------

function gameLoop(delta) {

    // Create an array of objects that will move with the environment
    let environment = [bg, gold].concat(enemies);

    function moveEnvironment(x, y) {
        environment.forEach(function (item) {
            item.y += y;
            item.x += x;
        })
    }

    Object.keys(controls).map(key => {
        keyboard(key).press = () => {
            controls[key] = true;
        }
        keyboard(key).release = () => {
            controls[key] = false;
        }
    })

    function movementPlayerTexture(textureDirection) {
        playerIdleTexture = playerSheet['idle_noArmorNaked_' + textureDirection];
        playerChestIdleTexture = playerSheet['idle_clothChest_' + textureDirection];
        if (!player.playing) {
            if (controls.ShiftLeft) {
                player.textures = playerSheet['running_noArmorNaked_' + textureDirection];
                playerChest.textures = playerSheet['running_clothChest_' + textureDirection]
            } else {
                player.textures = playerSheet['walking_noArmorNaked_' + textureDirection];
                playerChest.textures = playerSheet['walking_clothChest_' + textureDirection]
            }
            player.play();
            playerChest.play();
        }
    }

    function setPlayerSpeed() {
        if (player.playing) {
            if (controls.ShiftLeft) {
                // Running
                player.animationSpeed = playerStats.dexterity / 20;
                playerChest.animationSpeed = playerStats.dexterity / 20;
            } else {
                // Walking
                player.animationSpeed = playerStats.dexterity / 20;
                playerChest.animationSpeed = playerStats.dexterity / 20;
            }
        } else {
            // Idle
            player.animationSpeed = .6;
            playerChest.animationSpeed = .6;
            player.play();
            playerChest.play();
        }
    }

    // Controls
    if (controls.KeyW) {
        if (controls.KeyA) {
            movementPlayerTexture('UL');
        } else if (controls.KeyD) {
            movementPlayerTexture('UR');
        } else {
            movementPlayerTexture('U');
        }
        moveEnvironment(0, playerStats.speed());
        setPlayerSpeed();
    }

    if (controls.KeyA) {
        if (controls.KeyW) {
            movementPlayerTexture('UL');
        }
        else if (controls.KeyS) {
            movementPlayerTexture('DL');
        } else {
            movementPlayerTexture('L');
        }
        moveEnvironment(playerStats.speed(), 0);
        setPlayerSpeed();
    }

    if (controls.KeyS) {
        if (controls.KeyA) {
            movementPlayerTexture('DL');
        } else if (controls.KeyD) {
            movementPlayerTexture('DR');
        } else {
            movementPlayerTexture('D');
        }
        moveEnvironment(0, -playerStats.speed());
        setPlayerSpeed();
    }

    if (controls.KeyD) {
        if (controls.KeyW) {
            movementPlayerTexture('UR');
        } else if (controls.KeyS) {
            movementPlayerTexture('DR');
        } else {
            movementPlayerTexture('R');
        }
        moveEnvironment(-playerStats.speed(), 0);
        setPlayerSpeed();
    }

    // Idle animation if no keys are true
    if (!controls.KeyW && !controls.KeyA && !controls.KeyS && !controls.KeyD) {
        if (!player.playing) {
            player.textures = playerIdleTexture;
            playerChest.textures = playerChestIdleTexture;
            player.play();
            playerChest.play();
        }
    }

    // Running Reduce Fatigue
    if (controls.ShiftLeft) {
        if (playerStats.fatigue > 0) {
            playerStats.fatigue -= (playerStats.fatigueCost + playerStats.fatigueRegen);
        }
        resourceMeters.types.fatigue.inner.width = playerStats.fatigue * 2 - resourceMeters.innerOffset * 2;
    }

    if (playerStats.fatigue < playerStats.endurance) {
        if (playerStats.fatigue <= playerStats.fatigueRegen) {
            setTimeout(function () {
                playerStats.fatigue += playerStats.fatigueRegen;
            }, 3000);
        } else {
            playerStats.fatigue += playerStats.fatigueRegen;
        }
        resourceMeters.types.fatigue.inner.width = playerStats.fatigue * 2 - resourceMeters.innerOffset * 2;
    }

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

    // Game Over Scene
    messageGameOver = new Text("You died.", fontStyle);
    messageGameOver.x = app.view.width / 2 - messageGameOver.width / 2;
    messageGameOver.y = app.view.height / 2 - messageGameOver.height / 2;
    gameOverScene.addChild(messageGameOver);

    state(delta);
}

function play(delta) {



    if (hitTestRectangle(gold, player)) {
        ++inventory.currency.gold;
        gold.x = randomInt(bg.x, bg.x + bg.width - gold.width);
        gold.y = randomInt(bg.y, bg.y + bg.height - gold.height);
        bagUiGoldText.text = inventory.currency.gold;
    }

    let ratCage = gameScene.getChildByName("rats");
    for (let i = 0; i < numberOfRats - enemies.length; i++) {
        let rat = createEnemy(bg, "rat");
        enemies.push(rat);
        ratCage.addChild(rat);
    }
    enemies.forEach(function (enemy, index) {
        if (hitTestRectangle(enemy, player)) {
            if (playerStats.health > 0) {
                playerStats.health -= enemy.strength;
                resourceMeters.types.health.inner.width = playerStats.health * 2 - resourceMeters.innerOffset * 2;
            }

            if (click['mouse']) {
                if (enemy.health > 0) {
                    enemy.health -= playerStats.strength;
                }
                if (enemy.health <= 0) {
                    enemies.splice(index, 1);
                    enemy.visible = false
                }

            }
        }
    })

    if (playerStats.health <= 0) {
        state = end;
    }
}

function end() {
    gameScene.visible = false;
    gameOverScene.visible = true;
}

