import * as fs from 'fs';
import * as spritesheet_json from '../../assets/sprites/humanMale/main/noArmorNaked/spritesheets/humanMale_death_noArmorNaked.json' assert { type: 'json' };

let raceGender = 'humanMale';
let type = 'main'
let spriteId = 'noArmorNaked';
let animation = 'death';

let spritesheet = JSON.parse(JSON.stringify(spritesheet_json.default));
let directions = ['U', 'UR', 'R', 'DR', 'D', 'DL', 'L', 'UL'];
let animationsObject = {};

directions.forEach(function (direction) {
    let animationName = animation + '-' + spriteId + '-' + direction;
    animationsObject[animationName] = [];
})

Object.keys(spritesheet.frames).map(function (frame) {
    directions.forEach(function (direction) {
        if (frame.includes('-' + direction + '-')) {
            let animationName = animation + '-' + spriteId + '-' + direction;
            animationsObject[animationName].push(frame);
        }
    })
})

spritesheet['animations'] = animationsObject;
let json = JSON.stringify(spritesheet);
fs.writeFile('../../assets/sprites/' + raceGender + '/' + type + '/' + spriteId + '/spritesheets/' + raceGender + '_' + animation + '_' + spriteId + '.json', json, 'utf8', function () {
    console.log('Successfully appended animations to spritesheet.');
});