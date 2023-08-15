import { treeInstance } from './tree/tree.js';
import { staticEnvironmentInstance } from './staticEnvironment/staticEnvironment.js';

export let environment = [];

function pushEnvironment(createFn) {
    let environmentEntity = createFn;
    environment.push(environmentEntity);
}

export function environment_init() {
    // Create all environment entities here.
    pushEnvironment(treeInstance('oak1', 300, -400));
    pushEnvironment(staticEnvironmentInstance('rock1', 800, 400));
    pushEnvironment(staticEnvironmentInstance('rock2', 740, 450));
    pushEnvironment(staticEnvironmentInstance('rock3', 350, 200));
    pushEnvironment(staticEnvironmentInstance('stump1', 200, 350));
    pushEnvironment(staticEnvironmentInstance('stump2', 150, 400));
}

export function environment_events() {
    // Environment events used in game loop.
}