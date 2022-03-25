(function() {
	let number_of_rectangles = 1;
	let factor = 2;
	const INTERVAL = 750;

	function hsv_to_rgb(hue, saturation, value) {
		// https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
		// H in [0, 1] (position on the color wheel)
		// S in [0, 1]
		// V in [0, 1]

		let chroma = value * saturation;

		let hue_tag = hue * 6;

		let x = chroma * (1 - Math.abs((hue_tag % 2) - 1));

		let [red_1, green_1, blue_1] = ((hue_tag, chroma, x)=>{
			if (hue_tag >= 0 && hue_tag < 1) { return [chroma, x, 0];
			} else if (hue_tag >= 1 && hue_tag < 2) { return [x, chroma, 0];
			} else if (hue_tag >= 2 && hue_tag < 3) { return [0, chroma, x];
			} else if (hue_tag >= 3 && hue_tag < 4) { return [0, x, chroma];
			} else if (hue_tag >= 4 && hue_tag < 5) { return [x, 0, chroma];
			} else if (hue_tag >= 5 && hue_tag < 6) { return [chroma, 0, x];
			}
		})(hue_tag, chroma, x);

		let m = value - chroma;

		return [red_1 + m, green_1 + m, blue_1 + m];
	}

	function draw() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let rectangle_width = canvas.width / number_of_rectangles;

		for (
			let rectangle_number = 0;
			rectangle_number < number_of_rectangles;
			rectangle_number++
		) {
			ctx.beginPath();

			let rect_hsv_value = (number_of_rectangles - rectangle_number - 1) / (number_of_rectangles - 1);
			let rgb = hsv_to_rgb(0, 0, rect_hsv_value).map(x=>255 * x);
			ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

			let rectangle_x = rectangle_number * rectangle_width;

			ctx.fillRect(Math.floor(rectangle_x), 0, Math.ceil(rectangle_width), canvas.height);
		}
	}

	function resize_window() {
		// https://stackoverflow.com/a/32119392

		let canvas = document.getElementById('canvas');

		canvas.width = window.innerWidth;
		canvas.style.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.height = window.innerHeight;
	}

	function main() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		resize_window();
		//reset_world();

		//canvas.addEventListener('click', reset_world);

		window.addEventListener('resize', ()=>{resize_window(); draw();})

		draw();

		setInterval(
			()=>{
				if (number_of_rectangles > canvas.width) {
					factor = 0.5;
					number_of_rectangles = 2**Math.floor(Math.log2(canvas.width));
				} else if (number_of_rectangles < 1) {
					factor = 2;
					number_of_rectangles = 2;
				}
				number_of_rectangles = factor * number_of_rectangles;
				draw();
			}, INTERVAL);
	}

	window.addEventListener('load', main);
})();
