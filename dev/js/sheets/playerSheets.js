import { resources } from '../_game.js';

// Player Spritesheets
export let playerSheets;
export function playerSheets_setup() {
    playerSheets = {
        sheet_humanMale_idle_noArmorNaked: resources["../../assets/sprites/humanMale/main/noArmorNaked/spritesheets/humanMale_idle_noArmorNaked.json"].spritesheet,
        sheet_humanMale_walking_noArmorNaked: resources["../../assets/sprites/humanMale/main/noArmorNaked/spritesheets/humanMale_walking_noArmorNaked.json"].spritesheet,
        sheet_humanMale_running_noArmorNaked: resources["../../assets/sprites/humanMale/main/noArmorNaked/spritesheets/humanMale_running_noArmorNaked.json"].spritesheet,
        sheet_humanMale_idle_clothChest: resources["../../assets/sprites/humanMale/armor/clothChest/spritesheets/humanMale_idle_clothChest.json"].spritesheet,
        sheet_humanMale_idle_clothFeet: resources["../../assets/sprites/humanMale/armor/clothFeet/spritesheets/humanMale_idle_clothFeet.json"].spritesheet,
        sheet_humanMale_idle_clothHands: resources["../../assets/sprites/humanMale/armor/clothHands/spritesheets/humanMale_idle_clothHands.json"].spritesheet,
        sheet_humanMale_idle_clothHead: resources["../../assets/sprites/humanMale/armor/clothHead/spritesheets/humanMale_idle_clothHead.json"].spritesheet,
        sheet_humanMale_idle_clothLegs: resources["../../assets/sprites/humanMale/armor/clothLegs/spritesheets/humanMale_idle_clothLegs.json"].spritesheet,
        sheet_humanMale_idle_clothShoulders: resources["../../assets/sprites/humanMale/armor/clothShoulders/spritesheets/humanMale_idle_clothShoulders.json"].spritesheet,
        sheet_humanMale_walking_clothChest: resources["../../assets/sprites/humanMale/armor/clothChest/spritesheets/humanMale_walking_clothChest.json"].spritesheet,
        sheet_humanMale_walking_clothFeet: resources["../../assets/sprites/humanMale/armor/clothFeet/spritesheets/humanMale_walking_clothFeet.json"].spritesheet,
        sheet_humanMale_walking_clothHands: resources["../../assets/sprites/humanMale/armor/clothHands/spritesheets/humanMale_walking_clothHands.json"].spritesheet,
        sheet_humanMale_walking_clothHead: resources["../../assets/sprites/humanMale/armor/clothHead/spritesheets/humanMale_walking_clothHead.json"].spritesheet,
        sheet_humanMale_walking_clothLegs: resources["../../assets/sprites/humanMale/armor/clothLegs/spritesheets/humanMale_walking_clothLegs.json"].spritesheet,
        sheet_humanMale_walking_clothShoulders: resources["../../assets/sprites/humanMale/armor/clothShoulders/spritesheets/humanMale_walking_clothShoulders.json"].spritesheet,
        sheet_humanMale_running_clothChest: resources["../../assets/sprites/humanMale/armor/clothChest/spritesheets/humanMale_running_clothChest.json"].spritesheet,
        sheet_humanMale_running_clothFeet: resources["../../assets/sprites/humanMale/armor/clothFeet/spritesheets/humanMale_running_clothFeet.json"].spritesheet,
        sheet_humanMale_running_clothHands: resources["../../assets/sprites/humanMale/armor/clothHands/spritesheets/humanMale_running_clothHands.json"].spritesheet,
        sheet_humanMale_running_clothHead: resources["../../assets/sprites/humanMale/armor/clothHead/spritesheets/humanMale_running_clothHead.json"].spritesheet,
        sheet_humanMale_running_clothLegs: resources["../../assets/sprites/humanMale/armor/clothLegs/spritesheets/humanMale_running_clothLegs.json"].spritesheet,
        sheet_humanMale_running_clothShoulders: resources["../../assets/sprites/humanMale/armor/clothShoulders/spritesheets/humanMale_running_clothShoulders.json"].spritesheet,
    }
}

export function createPlayerSheet(raceGender, spritesheetId) {

    // Populate playerSheets array with spritesheet animations
    function anim(animation, spritesheetId, direction) {
        playerSheets[animation + '_' + spritesheetId + '_' + direction] = playerSheets['sheet_' + raceGender + '_' + animation + '_' + spritesheetId].animations[animation + '-' + spritesheetId + '-' + direction];
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