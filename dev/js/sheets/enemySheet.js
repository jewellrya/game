import { resources } from '../_game.js';

// enemy Spritesheets
export let enemySheets = {};

let animations = ['attack', 'death', 'eating', 'glance1', 'glance2', 'idle', 'running', 'startle', 'walking'];
let directions = ['R', 'DR', 'D', 'DL', 'L', 'UL', 'U', 'UR'];

// Function for returning an array of spritesheet directories.
export function getenemySheetsDirs() {
    let enemySheetDirContainer = [];
    function enemySheetsUrl(spriteId) {
        let rootDir = '../../assets/sprites/' + spriteId + '/spritesheets/';

        animations.forEach(animation => {
            let dir = rootDir + animation + '_' + spriteId + '.json';
            enemySheetDirContainer.push(dir);
        })
    }
    enemySheetsUrl('rat');
    return enemySheetDirContainer;
}

// Function for the playerSheets object setup that references each spritesheet and animation.
export function enemySheets_setup() {
    function enemySheetsUrl(spriteId) {
        let rootDir = '../../assets/sprites/' + spriteId + '/spritesheets/';

        animations.forEach(animation => {
            let dir = rootDir + animation + '_' + spriteId + '.json';
            enemySheets['sheet_' + animation + '_' + spriteId] = resources[dir].spritesheet;
            directions.forEach(direction => {
                enemySheets[animation + '_' + spriteId + '_' + direction] = enemySheets['sheet_' + animation + '_' + spriteId].animations[animation + '-' + spriteId + '-' + direction];
            })
        })
    }
    enemySheetsUrl('rat');
}