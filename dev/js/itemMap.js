import { getIconSheet } from './sheets/iconSheet.js';

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

export let itemsMap;
export function itemsMap_setup() {
    itemsMap = {
        clothChest: {
            icon: getIconSheet()['iconClothChest.png'],
            type: 'armor',
            equipable: true,
            slot: 'chest',
            stats: stats(0, 0, 0, 0, 1, 1, 0),
            armor: 3,
        },
        clothFeet: {
            icon: getIconSheet()['iconClothFeet.png'],
            type: 'armor',
            equipable: true,
            slot: 'feet',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 1,
        },
        clothHands: {
            icon: getIconSheet()['iconClothHands.png'],
            type: 'armor',
            equipable: true,
            slot: 'hands',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 1,
        },
        clothHead: {
            icon: getIconSheet()['iconClothHead.png'],
            type: 'armor',
            equipable: true,
            slot: 'head',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 2,
        },
        clothLegs: {
            icon: getIconSheet()['iconClothLegs.png'],
            type: 'armor',
            equipable: true,
            slot: 'legs',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 3,
        },
        clothShoulders: {
            icon: getIconSheet()['iconClothShoulders.png'],
            type: 'armor',
            equipable: true,
            slot: 'shoulders',
            stats: stats(0, 0, 0, 0, 1, 0, 0),
            armor: 2,
        },
        sword1h1: {
            icon: getIconSheet()['iconSword1h1.png'],
            type: 'weapon',
            equipable: true,
            slot: 'rightHand',
            stats: stats(2, 0, 0, 0, 0, 0, 0),
        },
        shield1: {
            icon: getIconSheet()['iconShield1.png'],
            type: 'shield',
            equipable: true,
            slot: 'leftHand',
            stats: stats(1, 3, 1, 0, 0, 0, 0),
            armor: 5,
        },
    }
}