import { resources } from '../_game.js';

// Player Spritesheets
export let playerSheetUrls;
export let playerSheets = {};

let spriteIds = {
    armor: ['clothChest', 'clothFeet', 'clothHands', 'clothHead', 'clothLegs', 'clothShoulders'],
    equipment: [],
    main: ['noArmorNaked'],
};

let animations = ['idle', 'walking', 'running'];
let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];

export function playerSheets_setup() {
    let spritesheetDirs = [];
    function playerSheetsUrl(raceGender) {
        let rootDir = '../../assets/sprites/';
        
        Object.keys(spriteIds).map(function (type) {
            let array = spriteIds[type];
            array.forEach(function (spriteId) {
                animations.forEach(function (animation) {
                    let url = rootDir + raceGender + '/' + type + '/' + spriteId + '/spritesheets/' + raceGender + '_' + animation + '_' + spriteId + '.json';
                    spritesheetDirs.push(url);
                    playerSheets['sheet_' + raceGender + '_' + animation + '_' + spriteId] = resources[url].spritesheet;
                    directions.forEach(function (direction) {
                        playerSheets[animation + '_' + spriteId + '_' + direction] = playerSheets['sheet_' + raceGender + '_' + animation + '_' + spriteId].animations[animation + '-' + spriteId + '-' + direction];
                    })
                })
            })
        })
        playerSheetUrls = spritesheetDirs;
    }
    playerSheetsUrl('humanMale');
}

let idleTexture;
export let getIdleTexture = () => idleTexture;
export let setIdleTexture = (val) => idleTexture = val;