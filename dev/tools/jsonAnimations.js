import * as fs from 'fs';
import * as spritesheet_json from '../../assets/sprites/humanMale/equipment/sword1h1/spritesheets/humanMale_1hAttackIdle_sword1h1.json' assert { type: 'json' };

let raceGender = 'humanMale';
let type = 'equipment'
let spriteId = 'sword1h1';
let animation = '1hAttackIdle';

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