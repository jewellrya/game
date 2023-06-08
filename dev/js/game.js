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
    Rectangle = PIXI.Rectangle,
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
    .add('../../assets/sprites/icons.json')
    .load(setup);

// Define variables in more than one function
let gameScene, gameOverScene;
let id, state, sheet;
let sheet_humanMale_noArmorNaked;
let sheet_icons;
let player, bg, gold;
let enemies = [];
let numberOfRats;
let fontStyle, bagIcon, characterIcon, bagUi, characterUi, uiMargin, bagUiBg, bagUiGoldIcon, bagUiGold;
let playerContainer, playerStats, inventory, messageGameOver;
let derppp;

let resourceMeters = {
    types: {
        health: {},
        fatigue: {},
        soul: {},
    }
};

let playerSheet = {};
let playerIdleTexture;

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

    inventory = {
        gold: 0
    }

    function createPlayerSheet() {
        // Populate playerSheet array with spritesheet animations
        function anim(name, direction) {
            playerSheet[name + '_noArmorNaked_' + direction] = sheet_humanMale_noArmorNaked.animations[name + '-noArmorNaked-' + direction];
        }

        let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];
        directions.forEach(function (direction) {
            anim('idle', direction);
            anim('walking', direction);
            anim('running', direction);
        })
    }

    function Base(parent) {
        // Create a base for sometric interactions
        let basePlane = .2;
        let baseOffSet = 3;
        let base = new Graphics();
        base.beginFill('0x000000');
        base.drawRect(
            parent.x - baseOffSet,
            (parent.height * basePlane) + baseOffSet * 2,
            parent.width + baseOffSet * 2,
            base.height = parent.width + baseOffSet * 2
        );
        parent.addChild(base);
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
        playerContainer.addChild(player);
        player.play();
    }

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

    uiMargin = 10;

    // bagIcon UI Button
    let bagIconScale = 1.75;
    let bagIconMargin = 15;
    bagIcon = new Sprite(sheet_icons['iconBag.png']);
    bagIcon.scale.set(bagIconScale, bagIconScale);
    bagIcon.x = app.view.width - bagIcon.width - bagIconMargin;
    bagIcon.y = app.view.height - bagIcon.height - bagIconMargin;
    bagIcon.interactive = true;
    gameScene.addChild(bagIcon);

    // Bag UI Window
    bagUi = new Container();
    bagUiBg = new Graphics();
    bagUiBg.beginFill('0x000000', .5);
    bagUiBg.drawRect(0, 0, 200, 200);
    bagUiBg.x = app.view.width - bagUiBg.width - 10;
    bagUiBg.y = app.view.height - bagUiBg.height - 60;
    bagUi.addChild(bagUiBg);

    // Gold Icon in Bag UI
    bagUiGoldIcon = new Sprite(sheet_icons['iconGold.png']);
    bagUiGoldIcon.x = bagUiBg.x + uiMargin;
    bagUiGoldIcon.y = bagUiBg.y + bagUiBg.height - bagUiGoldIcon.height - uiMargin;
    bagUi.addChild(bagUiGoldIcon);

    // Amount of Gold listed in bag
    bagUiGold = new Text(inventory.gold, fontStyle);
    bagUiGold.x = bagUiGoldIcon.x + 18;
    bagUiGold.y = bagUiGoldIcon.y - 1;
    bagUi.addChild(bagUiGold);

    let bagUiOpen = false;
    bagIcon.on('click', function () {
        if (!bagUiOpen) {
            gameScene.addChild(bagUi);
            bagUiOpen = true;
        } else {
            gameScene.removeChild(bagUi);
            bagUiOpen = false;
        }
    })

    // characterIcon UI Button
    let characterIconScale = 1.5;
    let characterIconMargin = 12;
    characterIcon = new Sprite(sheet_icons['iconCharacter.png']);
    characterIcon.scale.set(characterIconScale, characterIconScale);
    characterIcon.x = characterIconMargin;
    characterIcon.y = app.view.height - characterIcon.height - characterIconMargin;
    characterIcon.interactive = true;
    gameScene.addChild(characterIcon);

    // Character UI Window
    characterUi = new Graphics();
    characterUi.beginFill('0x000000', .5);
    characterUi.drawRect(0, 0, 200, 200);
    characterUi.x = 10;
    characterUi.y = app.view.height - characterUi.height - 60;

    let characterUiOpen = false;
    characterIcon.on('click', function () {
        console.log('character ui');
        if (!characterUiOpen) {
            gameScene.addChild(characterUi);
            characterUiOpen = true;
        } else {
            gameScene.removeChild(characterUi);
            characterUiOpen = false;
        }
    })

    state = play;
    createPlayerSheet();
    playerIdleTexture = playerSheet.idle_noArmorNaked_DR;
    createPlayer();

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {

    let secondaryStats = { endurance: playerStats.endurance, dexterity: playerStats.dexterity, speed: playerStats.speed(), fatigueRegen: Math.round(playerStats.fatigueRegen * 100), fatigueCost: Math.round(playerStats.fatigueCost * 50) };
    document.getElementById("playerStats").innerHTML = JSON.stringify(secondaryStats);

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
        if (!player.playing) {
            if (controls.ShiftLeft) {
                player.textures = playerSheet['running_noArmorNaked_' + textureDirection];
            } else {
                player.textures = playerSheet['walking_noArmorNaked_' + textureDirection];
            }
            player.play();
        }
    }

    function setPlayerSpeed() {
        if (player.playing) {
            if (controls.ShiftLeft) {
                // Running
                player.animationSpeed = playerStats.dexterity / 20;
            } else {
                // Walking
                player.animationSpeed = playerStats.dexterity / 20;
            }
        } else {
            // Idle
            player.animationSpeed = .6;
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
            player.play();
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
    let gameOverStyle = new TextStyle({
        fontFamily: 'Visitor',
        fontSize: 64,
        fill: 'white'
    });
    messageGameOver = new Text("You died.", gameOverStyle);
    messageGameOver.x = app.view.width / 2 - messageGameOver.width / 2;
    messageGameOver.y = app.view.height / 2 - messageGameOver.height / 2;
    gameOverScene.addChild(messageGameOver);

    state(delta);
}

function play(delta) {

    if (hitTestRectangle(gold, player)) {
        ++inventory.gold;
        gold.x = randomInt(bg.x, bg.x + bg.width - gold.width);
        gold.y = randomInt(bg.y, bg.y + bg.height - gold.height);
        bagUiGold.text = inventory.gold;
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

