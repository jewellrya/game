import { lootInstance, lootCollide_listener } from './loot/loot.js';

export let containers = [];

function pushContainer(createFn) {
    let container = createFn;
    containers.push(container);
}

export function containers_init() {
    // Create all containers here.
    pushContainer(lootInstance(550, 130, 'D'));
    pushContainer(lootInstance(1000, 100, 'U'));
}

export function containers_events() {
    // Containers events used in game loop.
    lootCollide_listener();
}