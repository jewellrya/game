import { createEnemy_rat, aggroEnemy_rat, contactEnemy_rat } from './rat/rat.js';

export let enemies = [];

function pushEnemy(createFn) {
    let enemy = createFn;
    enemies.push(enemy);
}

export function enemies_init() {
    // Create all enemies here.
    pushEnemy(createEnemy_rat());
}

export function enemies_events() {
    // Enemies events used in game loop.
    aggroEnemy_rat();
    contactEnemy_rat();
}