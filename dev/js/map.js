// import '../../node_modules/simplex-noise/simplex-noise.js';

// // Add browser prefixes to the requestAnimationFrame "Object Method"
// (function () {
// 	let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
// 		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
// 	window.requestAnimationFrame = requestAnimationFrame;
// });

// // Make canvas for map.
// let canvas = document.getElementById("simplexMapRender");
// canvas.width = 200;
// canvas.height = 200;
// let ctx = canvas.getContext("2d");

// let gen1 = new SimplexNoise();
// let gen2 = new SimplexNoise();
// let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);

// // Noise Entity Functions
// function noise1(nx, ny) {
// 	return gen1.noise2D(nx, ny) / 2 + 0.5;
// }

// function noise2(nx, ny) {
// 	return gen2.noise2D(nx, ny) / 2 + 0.5;
// }

// // Make Noise Map. Accentuate Green and Blue.
// function changeColorsToPerlin(data) {
// 	let width = canvas.width;
// 	let height = canvas.height;
// 	let octave1 = 1;
// 	let octave2 = 1;
// 	let xExp = .75;
// 	let yExp = .75;

// 	for (let x = 0; x < width; x++) {
// 		for (let y = 0; y < height; y++) {
// 			let nx = x / width - 0.5;
// 			let ny = y / height - 0.5;

// 			let e1 = (octave1 * noise1(1 * nx, 1 * ny));
// 			e1 = e1 / octave1;
// 			e1 = Math.pow(e1, xExp);

// 			// Another level to use later
// 			let e2 = (octave2 * noise2(1 * nx, 1 * ny));
// 			e2 = e2 / octave2;
// 			e2 = Math.pow(e2, yExp);

// 			// Need * 4 because each pixel is += 4
// 			let coordFormula = y * (width * 4) + (x * 4);

// 			data[coordFormula + 0] = 0; // r
// 			data[coordFormula + 1] = 255 * e1 * e2 // g
// 			data[coordFormula + 2] = 255 * (1 - e1) * (1 - e2); // b
// 			data[coordFormula + 3] = 255; // a
// 		}
// 	};
// }

// // Call functions to make noise map annd generate canvas.
// changeColorsToPerlin(imgdata.data);
// ctx.putImageData(imgdata, 0, 0);







// // Second Canvas - Isometric Map Render.
// let canvas2 = document.getElementById("textureMapRender");
// let ctx2 = canvas2.getContext("2d");

// // Image Preloader.
// let preload = function (imageArray, callback) {

// 	let imagesLoaded = 0;
// 	let loadedImages = [];

// 	for (let i = 0; i < imageArray.length; i++) {

// 		let imgObj = new Image();
// 		imgObj.src = imageArray[i].src;

// 		loadedImages.push(imgObj);

// 		imgObj.onload = function () {
// 			imagesLoaded++
// 			if (imagesLoaded === imageArray.length) {
// 				callback(loadedImages);
// 			}
// 		};
// 	}
// }

// // Apply Textures to pixels based on perlin noise.
// function texturizePerlin(loadedImages, perlinImageData) {

// 	canvas2.width = canvas.width * loadedImages[0].width;
// 	canvas2.height = canvas.height * loadedImages[0].height;

// 	// Adding Textures here from loadedImages().
// 	for (let i = 0; i < perlinImageData.length; i += 4) {
// 		let g = perlinImageData[i + 1];

// 		let x = (i / 4) % canvas.width;
// 		let y = Math.floor((i / 4) / canvas.width);

// 		function perlinTexture(imageIndex) {
// 			ctx2.drawImage(loadedImages[imageIndex], x * loadedImages[imageIndex].width, y * loadedImages[imageIndex].height);
// 		}

// 		function textureGradient(g, humidity) {

// 			function h(weight, humidityWeight) {
// 				let h = weight * humidity * humidityWeight;
// 				if (h >= 220) {
// 					return 220;
// 				} else if (h <= 0) {
// 					return 0;
// 				} else return h;
// 			}

// 			if (g >= h(4.4, 1)) {
// 				perlinTexture(0);
// 			} else if (g >= h(3.8, 1.025)) {
// 				perlinTexture(1);
// 			} else if (g >= h(3.8, 1)) {
// 				perlinTexture(1);
// 			} else if (g >= h(3.4, 1)) {
// 				perlinTexture(3);
// 			} else if (g >= h(3, 1)) {
// 				perlinTexture(4);
// 			} else if (g >= h(2.2, .8)) {
// 				perlinTexture(6);
// 			} else if (g >= h(1.8, .8)) {
// 				perlinTexture(8);
// 			} else if (g >= h(1.6, 1.05)) {
// 				perlinTexture(10);
// 			} else if (g >= h(1.3, 1.05)) {
// 				perlinTexture(12);
// 			} else if (g >= h(1.2, 1.1)) {
// 				perlinTexture(13);
// 			} else if (g >= h(1.1, 1.3)) {
// 				perlinTexture(14);
// 			} else if (g >= h(1, 1.2)) {
// 				perlinTexture(15);
// 			} else if (g >= 0) {
// 				perlinTexture(16);
// 			}
// 		}

// 		// Humidity 0-100.
// 		textureGradient(g, 45);
// 	}
// }

// // Draw each texture into canvas based on texturizePerlin().
// function drawTexture(imageArray) {
// 	preload(imageArray, function (loadedImages) {

// 		texturizePerlin(loadedImages, imgdata.data);

// 		let img = canvas2.toDataURL("image/png");
// 		let charGenComponent = '<img id="img_texture" src="' + img + '"/>';

// 		document.getElementById('textureMapImage').innerHTML = charGenComponent;

// 		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
// 	});
// }

// // Array of Texture pngs used in drawTexture function.
// let array = [
// 	{
// 		// 0
// 		src: '../../assets/sprites/terrain/icecap.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 1
// 		src: '../../assets/sprites/terrain/mountain-1.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 2
// 		src: '../../assets/sprites/terrain/mountain-2.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 3
// 		src: '../../assets/sprites/terrain/taiga-1.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 4
// 		src: '../../assets/sprites/terrain/taiga-2.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 5
// 		src: '../../assets/sprites/terrain/grass-1.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 6
// 		src: '../../assets/sprites/terrain/grass-2.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 7
// 		src: '../../assets/sprites/terrain/grass-4.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 8
// 		src: '../../assets/sprites/terrain/grass-3.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 8
// 		src: '../../assets/sprites/terrain/sand-4.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 10
// 		src: '../../assets/sprites/terrain/sand-3.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 11
// 		src: '../../assets/sprites/terrain/sand-2.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 12
// 		src: '../../assets/sprites/terrain/sand-1.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 13
// 		src: '../../assets/sprites/terrain/water-4.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 14
// 		src: '../../assets/sprites/terrain/water-3.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 15
// 		src: '../../assets/sprites/terrain/water-2.png',
// 		width: 20,
// 		height: 20
// 	},
// 	{
// 		// 16
// 		src: '../../assets/sprites/terrain/water-1.png',
// 		width: 20,
// 		height: 20
// 	},
// ]

// drawTexture(array);

// // This is just an animation cycle to see how its rendering
// function update() {
// 	requestAnimationFrame(update);
// }

// update();