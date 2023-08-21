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
    objectChunkDispertion({ createEntityFn: treeInstance.bind(null, 'oak1'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '1' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'rock1'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '2' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'rock2'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '3' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'rock3'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '4' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'stump1'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '5' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'stump2'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '6' });
    objectChunkDispertion({ createEntityFn: staticEnvironmentInstance.bind(null, 'mushrooms'), pushEntityFn: pushEnvironment, entityDensity: 0.01, objectSeed: '7' });
}

export function environment_events() {
    // Environment events used in game loop.
    checkPlayerBehindTree();
}