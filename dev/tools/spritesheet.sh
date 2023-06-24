echo Provide existing objects in camelcase:
read -p 'Race/Gender [humanMale]: ' raceGender
raceGender=${raceGender:-humanMale}
read -p 'Type [armor]: ' type
type=${type:-armor}
read -p 'SpriteID: ' spriteId
read -p 'Animation: ' animation

spritesheet-js -p ../../assets/sprites/$raceGender/$type/$spriteId/spritesheets -n humanMale_$animation\_$spriteId -f pixi.js ../../assets/sprites/$raceGender/$type/$spriteId/sprites/$animation-*.png