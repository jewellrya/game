import { getIconSheet } from './sheets/iconSheet.js';

function stats(str, end, vit, dex, int, wis, cha, arm) {
    return {
        strength: str,
        endurance: end,
        vitality: vit,
        dexterity: dex,
        intelligence: int,
        wisdom: wis,
        charisma: cha,
        armor: arm
    }
}

export let itemsMap;
export function itemsMap_init() {
    itemsMap = {
        clothChest: {
            name: 'Burlap Robes',
            icon: getIconSheet()['iconClothChest.png'],
            type: 'armor',
            equipable: true,
            slot: 'chest',
            stats: stats(0, 0, 0, 0, 1, 1, 0, 3),
        },
        clothFeet: {
            name: 'Burlap Boots',
            icon: getIconSheet()['iconClothFeet.png'],
            type: 'armor',
            equipable: true,
            slot: 'feet',
            stats: stats(0, 0, 0, 0, 1, 0, 0, 1),
        },
        clothHands: {
            name: 'Burlap Gloves',
            icon: getIconSheet()['iconClothHands.png'],
            type: 'armor',
            equipable: true,
            slot: 'hands',
            stats: stats(0, 0, 0, 0, 1, 0, 0, 1),
        },
        clothHead: {
            name: 'Burlap Hood',
            icon: getIconSheet()['iconClothHead.png'],
            type: 'armor',
            equipable: true,
            slot: 'head',
            stats: stats(0, 0, 0, 0, 1, 0, 0, 2),
        },
        clothLegs: {
            name: 'Burlap Trousers',
            icon: getIconSheet()['iconClothLegs.png'],
            type: 'armor',
            equipable: true,
            slot: 'legs',
            stats: stats(0, 0, 0, 0, 1, 0, 0, 3),
        },
        clothShoulders: {
            name: 'Burlap Pauldrons',
            icon: getIconSheet()['iconClothShoulders.png'],
            type: 'armor',
            equipable: true,
            slot: 'shoulders',
            stats: stats(0, 0, 0, 0, 1, 0, 0, 2),
        },
        sword1h1: {
            name: 'Rusty Sword',
            icon: getIconSheet()['iconSword1h1.png'],
            type: 'weapon',
            equipable: true,
            slot: 'rightHand',
            stats: stats(2, 0, 0, 0, 0, 0, 0, 0),
        },
        shield1: {
            name: 'Rusty Shield',
            icon: getIconSheet()['iconShield1.png'],
            type: 'shield',
            equipable: true,
            slot: 'leftHand',
            stats: stats(1, 3, 1, 0, 0, 0, 0, 5),
        },
    }
}