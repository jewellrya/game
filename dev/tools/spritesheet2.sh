echo Provide existing objects in camelcase:
read -p 'SpriteID: ' spriteId
read -p 'Animation: ' animation

spritesheet-js -p ../../assets/sprites/$spriteId/spritesheets -n $animation\_$spriteId -f pixi.js ../../assets/sprites/$spriteId/sprites/$animation-*.png