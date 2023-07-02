import { getEquipped, getEquippedSlot } from '../../../player/playerData.js';

export function equippedItemLoop(callback) {
    Object.keys(getEquipped()).forEach(slot => {
        let equippedItem = getEquippedSlot(slot);
        if (equippedItem.item) {
            callback(equippedItem, slot);
        }
    })
}