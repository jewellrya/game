import { resources } from '../_game.js';

// Player Spritesheets
export let playerSheets = {};

let spriteIds = {
    armor: ['clothChest', 'clothFeet', 'clothHands', 'clothHead', 'clothLegs', 'clothShoulders'],
    equipment: [],
    main: ['noArmorNaked'],
};

let animations = ['idle', 'walking', 'running'];
let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];

// Function for returning an array of spritesheet directories.
export function getPlayerSheetsDirs() {
    let playerSheetDirContainer = [];
    function playerSheetsUrl(raceGender) {
        let rootDir = '../../assets/sprites/';
        
        Object.keys(spriteIds).map(function (type) {
            let array = spriteIds[type];
            array.forEach(function (spriteId) {
                animations.forEach(function (animation) {
                    let dir = rootDir + raceGender + '/' + type + '/' + spriteId + '/spritesheets/' + raceGender + '_' + animation + '_' + spriteId + '.json';
                    playerSheetDirContainer.push(dir);
                })
            })
        })
    }
    playerSheetsUrl('humanMale');
    return playerSheetDirContainer;
}

// Function for the playerSheets object setup that references each spritesheet.
export function playerSheets_setup() {
    function playerSheetsUrl(raceGender) {
        let rootDir = '../../assets/sprites/';
        
        Object.keys(spriteIds).map(function (type) {
            let array = spriteIds[type];
            array.forEach(function (spriteId) {
                animations.forEach(function (animation) {
                    let dir = rootDir + raceGender + '/' + type + '/' + spriteId + '/spritesheets/' + raceGender + '_' + animation + '_' + spriteId + '.json';
                    playerSheets['sheet_' + raceGender + '_' + animation + '_' + spriteId] = resources[dir].spritesheet;
                    directions.forEach(function (direction) {
                        playerSheets[animation + '_' + spriteId + '_' + direction] = playerSheets['sheet_' + raceGender + '_' + animation + '_' + spriteId].animations[animation + '-' + spriteId + '-' + direction];
                    })
                })
            })
        })
    }
    playerSheetsUrl('humanMale');
}

let idleTexture;
export let getIdleTexture = () => idleTexture;
export let setIdleTexture = (val) => idleTexture = val;