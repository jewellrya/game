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
			
			// Another level to use later
			let m = (yOctave * noise2( 1 * nx,  1 * ny));
			m = m / yOctave;

			// Need * 4 because each pixel is += 4
			let coordFormula = y * (width * 4) + (x * 4);
			
			data[coordFormula + 0] = 0; // r
			data[coordFormula + 1] = 255 * e; // g
			data[coordFormula + 2] = 255 * (1 - e); // b
			data[coordFormula + 3] = 255; // a
		}
	};
}

changeColorsToPerlin(imgdata.data);
ctx.putImageData(imgdata, 0, 0);



















let canvas2 = document.getElementById("mapTest");
let ctx2 = canvas2.getContext("2d");

let preload = function(imageArray, callback) {

	let imagesLoaded = 0;
	let loadedImages = [];

	for (let i = 0; i < imageArray.length; i++) {

		let imgObj = new Image();
		imgObj.src = imageArray[i].src;
		
		loadedImages.push(imgObj);

		imgObj.onload = function() {
			imagesLoaded++
			if(imagesLoaded === imageArray.length) {
				callback(loadedImages);
			}
		};
	}
}

function replicatePerlin(loadedImages, perlinImageData) {

	canvas2.width = canvas.width * loadedImages[0].width;
	canvas2.height = canvas.height * loadedImages[0].height;

	for( let i = 0; i < perlinImageData.length; i+=4) {
        let g = perlinImageData[i + 1];

		let x = (i / 4) % canvas.width;
		let y = Math.floor((i / 4) / canvas.width);

		if (g >= 150) {
			ctx2.drawImage(loadedImages[0], x * loadedImages[0].width, y * loadedImages[0].height);
        } else {
			ctx2.drawImage(loadedImages[1], x * loadedImages[1].width, y * loadedImages[1].height);
		}
	}
}

function drawTexture(imageArray) {
	preload(imageArray, function(loadedImages){

		// for (let i = 0; i < imageArray.length; i++) {
		// 	ctx2.drawImage(loadedImages[i], imageArray[i].x, imageArray[i].y);
		// }

		replicatePerlin(loadedImages, imgdata.data);

		let img = canvas2.toDataURL("image/png");
		let charGenComponent = '<img id="img_texture" src="' + img + '"/>';

		document.getElementById('genMap').innerHTML = charGenComponent;

		ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
		
	});
}

let array = [
	{
		src: '../../assets/grassTest.png',
		width: 20,
		height: 20
	},
	{
		src: '../../assets/waterTest.png',
		width: 20,
		height: 20
	},
]

drawTexture(array);


// function genMapTextures(data) {
// 	for( let i = 0; i < data.length; i+=4) {
// 		let r = data[i + 0];
//         let g = data[i + 1];
//         let b = data[i + 2];
//         let a = data[i + 3];

// 		if (r === rgbFind[0] && g === rgbFind[1] && b === rgbFind[2] && a === 255) {
// 			data[i + 0] = rgbReplace[0];
//             data[i + 1] = rgbReplace[1];
//             data[i + 2] = rgbReplace[2];
//         }
// 	}
// }

// This is just an animation cycle to see how its rendering
function update() {
    requestAnimationFrame(update);
}

update();