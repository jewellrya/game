import '../../node_modules/simplex-noise/simplex-noise.js';

// Add browser prefixes to the requestAnimationFrame "Object Method"
(function() {
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
});

let canvas = document.getElementById("map");
let ctx = canvas.getContext("2d");

let gen1 = new SimplexNoise();
let gen2 = new SimplexNoise();
let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);

function noise1(nx, ny) {
	return gen1.noise2D(nx, ny) / 2 + 0.5;
}

function noise2(nx, ny) {
	return gen2.noise2D(nx, ny) / 2 + 0.5;
}

function changeColorsToPerlin(data) {
	let width = canvas.width;
	let height = canvas.height;
	let xOctave = 1;
	let xExp = 1.25;
	let yOctave = 1;
	
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			let nx = x/width - 0.5;
			let ny = y/height - 0.5;

			let e = (xOctave * noise1( 1 * nx, 1 * ny));
			e = e / xOctave;
			e = Math.pow(e, xExp);
			
			let m = (yOctave * noise2( 1 * nx,  1 * ny));
			m = m / yOctave;

			// Need * 4 because each pixel is += 4
			let coordFormula = y * (width * 4) + (x * 4);
			data[coordFormula + 0] = e / m * 255; // r
			data[coordFormula + 1] = e / m * 255; // g
			data[coordFormula + 2] = e / m * 255; // b
			data[coordFormula + 3] = 255; // b
		}
	};
}

changeColorsToPerlin(imgdata.data);

ctx.putImageData(imgdata, 0, 0);

// This is just an animation cycle to see how its rendering
function update() {
    requestAnimationFrame(update);
}

update();