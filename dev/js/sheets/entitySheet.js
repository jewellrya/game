import { resources } from '../_game.js';

// Entity Spritesheets
export let entitySheets = {};

let animations = ['attack', 'death', 'eating', 'glance1', 'glance2', 'idle', 'running', 'startle', 'walking'];
let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];

// Function for returning an array of spritesheet directories.
export function getEntitySheetsDirs() {
    let entitySheetDirContainer = [];
    function entitySheetsUrl(spriteId) {
        let rootDir = '../../assets/sprites/' + spriteId + '/spritesheets/';

        animations.forEach(animation => {
            let dir = rootDir + animation + '_' + spriteId + '.json';
            entitySheetDirContainer.push(dir);
        })
    }
    entitySheetsUrl('rat');
    return entitySheetDirContainer;
}

// Function for the playerSheets object setup that references each spritesheet and animation.
export function entitySheets_setup() {
    function entitySheetsUrl(spriteId) {
        let rootDir = '../../assets/sprites/' + spriteId + '/spritesheets/';

        animations.forEach(animation => {
            let dir = rootDir + animation + '_' + spriteId + '.json';
            entitySheets['sheet_' + animation + '_' + spriteId] = resources[dir].spritesheet;
            directions.forEach(direction => {
                entitySheets[animation + '_' + spriteId + '_' + direction] = entitySheets['sheet_' + animation + '_' + spriteId].animations[animation + '-' + spriteId + '-' + direction];
            })
        })
    }
    entitySheetsUrl('rat');
}