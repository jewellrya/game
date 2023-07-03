import * as fs from 'fs';
import * as spritesheet_json from '../../assets/sprites/rat/spritesheets/walking_rat.json' assert { type: 'json' };

let spriteId = 'rat';
let animation = 'walking';

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
fs.writeFile('../../assets/sprites/' + spriteId + '/spritesheets/' + animation + '_' + spriteId + '.json', json, 'utf8', function () {
    console.log('Successfully appended animations to spritesheet.');
});