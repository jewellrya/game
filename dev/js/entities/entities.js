import { rat } from './enemies/rat.js';
import { lootArray } from './containers/loot.js';

export let entities = [];

export function entitiesArray_setup() {
    entities.push(rat);
    lootArray.forEach(loot => {
        entities.push(loot.container);
    })
}
