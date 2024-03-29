import { keysDown } from '../controllers/keyboard.js';
import { itemData } from '../items/itemData.js';

export let playerRaceGender = 'humanMale';
export let playerName = 'characterName';

export let playerStats = {
    // Primary Stats
    strength: 10, // Affects physical weapon damage, weapon fatigue cost.
    endurance: 10, // Affects damage resistance, fatigue amount.
    vitality: 10, // Affects health amount, and health regen.
    dexterity: 10, // Affects walking speed, weapon speed, magic speed, and fatigue regen.
    intelligence: 10, // Affects magic damage and magic cost.
    wisdom: 10, // Affects soul amount and soul regen.
    charisma: 10, // Dialogue options. 
}

// Secondary Stats (Ones Based on Primary)
playerStats.health = 10 + (playerStats.vitality * 0.2 );
playerStats.fatigue = 10 + (playerStats.endurance * 0.2);
playerStats.soul = 10 + (playerStats.wisdom * 0.2);

playerStats.fatigueCost = .05;
playerStats.fatigueRegen = playerStats.dexterity / 600;
playerStats.speed = function () {
    if (keysDown.ShiftLeft && playerStats.fatigue > 0) {
        return (1 + playerStats.dexterity / 7);
    } else {
        return 1 + playerStats.dexterity / 30;
    }
}

let inventory = {
    currency: {
        gold: 0,
        silver: 0,
        copper: 0,
    },
    items: [],
}

if (inventory.currency.copper >= 100) {
    inventory.currency.copper = (inventory.currency.copper % 100);
    inventory.currency.silver += (inventory.currency.copper / 100);
}

if (inventory.currency.silver >= 100) {
    inventory.currency.silver = (inventory.currency.silver % 100);
    inventory.currency.gold += (inventory.currency.silver / 100);
}

export let getInventory = () => inventory;
export let setInventoryCopper = (val) => (inventory.currency.copper = val);
export let getInventoryItems = () => inventory.items;
export let setInventoryItem = (i, val) => inventory.items[i].item = val;
export let getInventorySlot = (slot) => inventory.items[slot];

// Cosmetics for much later.
let cosmetics = {
    hair: {
        color: 1,
        head: {
            id: 1,
            animatedSprite: null,
            idleTexture: null,
        },
        beard: {
            id: 1,
            animatedSprite: null,
            idleTexture: null,
        },
    },
    skin: {
        color: 1,
    },
    tattoo: {
        color: 1,
        id: 1,
        animatedSprite: null,
        idleTexture: null,
    },
    adornments: {
        color: 1,
        id: 1,
        animatedTexture: null,
        idleTexture: null,
    }
}

let equipped = {
    head: {
        item: null,
        cubby: null,
        defaultSprite: 'iconHead.png',
        animatedSprite: null,
        idleTexture: null,
    },
    feet: {
        item: null,
        cubby: null,
        defaultSprite: 'iconFeet.png',
        animatedSprite: null,
        idleTexture: null,
    },
    legs: {
        item: 'clothLegs',
        cubby: null,
        defaultSprite: 'iconLegs.png',
        animatedSprite: null,
        idleTexture: null,
    },
    chest: {
        item: null,
        cubby: null,
        defaultSprite: 'iconChest.png',
        animatedSprite: null,
        idleTexture: null,
    },
    shoulders: {
        item: null,
        cubby: null,
        defaultSprite: 'iconShoulders.png',
        animatedSprite: null,
        idleTexture: null,
    },
    hands: {
        item: null,
        cubby: null,
        defaultSprite: 'iconHands.png',
        animatedSprite: null,
        idleTexture: null,
    },
    rightHand: {
        item: 'sword1h1',
        cubby: null,
        defaultSprite: 'iconWeapon.png',
        animatedSprites: null,
        idleTexture: null,
    },
    leftHand: {
        item: 'shield1',
        cubby: null,
        defaultSprite: 'iconShield.png',
        animatedSprites: null,
        idleTexture: null,
    },
    resourceItem: {
        item: null,
        cubby: null,
        defaultSprite: 'iconArrow.png',
        animatedSprites: null,
        idleTexture: null,
    },
}

export let getEquipped = () => equipped;
export let getEquippedSlot = (slot) => equipped[slot];
export let setEquippedSlot = (slot, val) => equipped[slot] = val;
export let getEquippedCubby = (slot) => equipped[slot].cubby;
export let setEquippedCubby = (slot, val) => equipped[slot].cubby = val;
export let getEquippedAnimatedSprites = (slot) => equipped[slot].animatedSprites;
export let setEquippedAnimatedSprites = (slot, val) => equipped[slot].animatedSprites = val;
export let getEquippedIdleTexture = (slot) => equipped[slot].idleTexture;
export let setEquippedIdleTexture = (slot, val) => equipped[slot].idleTexture = val;