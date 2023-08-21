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
    objectChunkDispertion({ createObjectFn: treeInstance.bind(null, 'oak1'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '1' });
    objectChunkDispertion({ createObjectFn: staticEnvironmentInstance.bind(null, 'rock1'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '2' });
    objectChunkDispertion({ createObjectFn: staticEnvironmentInstance.bind(null, 'rock2'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '3' });
    objectChunkDispertion({ createObjectFn: staticEnvironmentInstance.bind(null, 'rock3'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '4' });
    objectChunkDispertion({ createObjectFn: staticEnvironmentInstance.bind(null, 'stump1'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '5' });
    objectChunkDispertion({ createObjectFn: staticEnvironmentInstance.bind(null, 'stump2'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '6' });
    objectChunkDispertion({ createObjectFn: staticEnvironmentInstance.bind(null, 'mushrooms'), pushObjectFn: pushEnvironment, objectDensity: 0.01, objectSeed: '7' });
}

export function environment_events() {
    // Environment events used in game loop.
    checkPlayerBehindTree();
}