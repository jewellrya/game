import {randomInt, randomIntReverse} from "./random.js";
export default function(bg, spriteName) {
  const sheet = PIXI.Loader.shared.resources["../../assets/sprites.json"].spritesheet;
  let enemy = new PIXI.AnimatedSprite(sheet.animations[spriteName]);
  enemy.x = randomInt(bg.x, bg.x + bg.width - enemy.width);
  enemy.y = randomInt(bg.y, bg.y + bg.height - enemy.height);
  enemy.scale.set(2.5, 2.5);
  enemy.animationSpeed = .2;
  enemy.direction = randomIntReverse[randomInt(0, 1)];
  enemy.play();
  enemy.speed = 1;
  enemy.strength = .01;
  enemy.health = 100;
  return enemy;
}
