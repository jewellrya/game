import { resources } from '../_game.js';

// Environment Spritesheets
export let environmentSheets = {};

let dir = '../../assets/sprites/environment/spritesheets/environment.json';

let staticSprites = ['mushrooms', 'rock1', 'rock2', 'rock3', 'stump1', 'stump2', 'grass_texture-1', 'grass_texture-2', 'grass_texture-3'];
let animatedSprites = ['oak1', 'oak1shadow'];

function environmentSheets_generate(spriteId, animated) {
    if (!animated) {
        environmentSheets[spriteId] = resources[dir].textures[spriteId + '.png'];
    } else {
        environmentSheets[spriteId] = resources[dir].spritesheet.animations[spriteId];
    }
}

export function environmentSheets_setup() {
    // Static Sprites
    staticSprites.forEach(spriteId => {
        environmentSheets_generate(spriteId, false);
    })
    // Animated Sprites
    animatedSprites.forEach(spriteId => {
        environmentSheets_generate(spriteId, true);
    })
}