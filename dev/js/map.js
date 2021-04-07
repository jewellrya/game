import '../../node_modules/simplex-noise/simplex-noise.js';

// // Aliases
// let Application = PIXI.Application,
//     loader = PIXI.Loader,
//     TextureCache = PIXI.utils.TextureCache,
//     resources = PIXI.Loader.shared.resources,
//     Sprite = PIXI.Sprite,
//     AnimatedSprite = PIXI.AnimatedSprite,
//     Container = PIXI.Container,
//     Text = PIXI.Text,
//     TextStyle = PIXI.TextStyle,
//     Graphics = PIXI.Graphics,
//     Rectangle = PIXI.Rectangle,
//     u = new SpriteUtilities(PIXI);

// // Create a Pixi Application
// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// let app = new Application({
//     width: 800,
//     height: 800
// });

// // Add the canvas that Pixi automatically created for you.
// document.body.appendChild(app.view);

// loader.shared
//     .add('../../assets/sprites.json')
//     .load(setup);

// let gameScene, sheet, id, map, state, simplex, land;

// function setup() {
// 	sheet = PIXI.Loader.shared.resources["../../assets/sprites.json"].spritesheet;
//     id = PIXI.Loader.shared.resources['../../assets/sprites.json'].textures;

// 	gameScene = new Container();
//     app.stage.addChild(gameScene);

// 	simplex = new SimplexNoise();

// 	map = new Graphics();
//     map.beginFill('0x000080');
//     map.drawRect(0, 0, app.view.width, app.view.height);
//     map.endFill();
//     gameScene.addChild(map);

// 	state = play;
	
// 	app.ticker.add(delta => gameLoop(delta));
// }

// function gameLoop(delta) {
// 	state(delta);

// 	for (var x = 0; x < 256; x++) {
// 		for (var y = 0; y < 256; y++) {
// 			var r = simplex.noise3D(x / 16, y / 16, delta / 16) * 0.5 + 0.5;
// 		}
// 	}

// 	land = new Graphics();
//     land.beginFill('0x00ff00');
//     land.drawRect(r * app.stage.height, r * app.stage.height, 10, 10);
//     land.endFill();
//     gameScene.addChild(land);
// }

// function play(delta) {
// }

// function generateHeight() {
// 	return Math.round(Math.random() * 1000);
// }

// Add browser prefixes to the requestAnimationFrame "Object Method"
(function() {
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
});

function update() {
    requestAnimationFrame(update);

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

	var simplex = new SimplexNoise(),
		imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height),
		data = imgdata.data,
		t = 0;
	
	for (var x = 0; x < 256; x++) {
		for (var y = 0; y < 256; y++) {
			var r = simplex.noise3D(x / 16, y / 16, t/16) * 0.5 + 0.5;
			var g = simplex.noise3D(x / 8, y / 8, t/16) * 0.5 + 0.5;
			data[(x + y * 256) * 4 + 0] = r * 255;
			data[(x + y * 256) * 4 + 1] = (r + g) * 200;
			data[(x + y * 256) * 4 + 2] = 0;
			data[(x + y * 256) * 4 + 3] = 255;
		}
	};
		
	ctx.putImageData(imgdata, 0, 0);
}

update();