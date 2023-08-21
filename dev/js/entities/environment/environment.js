import { treeInstance, checkPlayerBehindTree } from './tree/tree.js';
import { staticEnvironmentInstance } from './staticEnvironment/staticEnvironment.js';
import { objectChunkDispertion } from '../utilities/entities_utilities.js';

export let environment = [];

function pushEnvironment(createFn) {
    let environmentEntity = createFn;
    environment.push(environmentEntity);
}

export function environment_init() {
    // Create all environment entities here.
    objectChunkDispertion({ createEntityFn: treeInstance.bind(null, 'oak1'), pushEntityFn: pushEnvironment, entityDensity: 0.01, seed: '0000' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'rock1'), pushEntityFn: pushEnvironment, entityDensity: 0.01, seed: '2222' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'rock2'), pushEntityFn: pushEnvironment, entityDensity: 0.01, seed: '3333' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'rock3'), pushEntityFn: pushEnvironment, entityDensity: 0.01, seed: '4444' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'stump1'), pushEntityFn: pushEnvironment, entityDensity: 0.01, seed: '5555' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'stump2'), pushEntityFn: pushEnvironment, entityDensity: 0.01, seed: '1111' });
}

export function environment_events() {
    // Environment events used in game loop.
    checkPlayerBehindTree();
}