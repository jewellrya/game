import { lootInstance } from './loot/loot.js';

export let containers = [];

function pushContainer(createFn) {
    let container = createFn;
    containers.push(container);
}

export function containers_init() {
    // Create all containers here.
    pushContainer(lootInstance(550, 180, 'D'));
}