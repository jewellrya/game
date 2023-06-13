import { resources } from '../_game.js';

// Player Spritesheets
export let playerSheets;
export function playerSheets_setup() {
    playerSheets = {
        sheet_humanMale_noArmorNaked: resources["../../assets/sprites/humanMale/main/humanMale_noArmorNaked.json"].spritesheet,
        sheet_humanMale_clothChest: resources["../../assets/sprites/humanMale/armor/humanMale_clothChest.json"].spritesheet,
        sheet_humanMale_clothFeet: resources["../../assets/sprites/humanMale/armor/humanMale_clothFeet.json"].spritesheet,
        sheet_humanMale_clothHands: resources["../../assets/sprites/humanMale/armor/humanMale_clothHands.json"].spritesheet,
        sheet_humanMale_clothHead: resources["../../assets/sprites/humanMale/armor/humanMale_clothHead.json"].spritesheet,
        sheet_humanMale_clothLegs: resources["../../assets/sprites/humanMale/armor/humanMale_clothLegs.json"].spritesheet,
        sheet_humanMale_clothShoulders: resources["../../assets/sprites/humanMale/armor/humanMale_clothShoulders.json"].spritesheet,
    }
}

export function createPlayerSheet(raceGender, spritesheetId) {
    // Populate playerSheets array with spritesheet animations
    function anim(animation, spritesheetId, direction) {
        playerSheets[animation + '_' + spritesheetId + '_' + direction] = playerSheets['sheet_' + raceGender + '_' + spritesheetId].animations[animation + '-' + spritesheetId + '-' + direction];
    }

    let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];
    let animations = ['idle', 'walking', 'running'];

    directions.forEach(function (direction) {
        animations.forEach(function (animation) {
            anim(animation, spritesheetId, direction);
        })
    })
}

let idleTexture;
export let getIdleTexture = () => idleTexture;
export let setIdleTexture = (val) => idleTexture = val;