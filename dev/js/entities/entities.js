import { enemy } from './enemies/bandit.js';
import { lootArray } from './containers/loot.js';

export let entities = [];

export function entitiesArray_setup() {
    entities.push(enemy);
    lootArray.forEach(loot => {
        entities.push(loot.container);
    })
    console.log(entities);
}
