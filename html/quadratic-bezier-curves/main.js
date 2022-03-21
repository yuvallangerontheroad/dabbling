'use strict;'

Math.TAU = 2 * Math.PI;

(function() {
	let line_a = [
		[Math.random(), Math.random()],
		[Math.random(), Math.random()],
	];

	let line_b = [
		[Math.random(), Math.random()],
		[Math.random(), Math.random()],
	];

	const HSV_VALUE_VALUE = 0.7;
	const HSV_SATURATION_VALUE = 0.7;
	const WANTED_NUMBER_OF_LINES = 50;

	function lerp(p, a, b) {
		return p * (b - a) + a;
	}

	function lerp_2d(p, a, b) {
		return [
			lerp(p, a[0], b[0]),
			lerp(p, a[1], b[1]),
		];
	}

	function hsv_to_rgb(hue, saturation, value) {
		// https://en.wikipedia.org/wiki/HSL_and_HSV#HSV_to_RGB
		// H in [0, 1] (position on the color wheel)
		// S in [0, 1]
		// V in [0, 1]

		let chroma = value * saturation;

		let hue_tag = hue * 6;

		let x = chroma * (1 - Math.abs((hue_tag % 2) - 1));

		let red_1, green_1, blue_1;

		if (hue_tag >= 0 && hue_tag < 1) { 
			[red_1, green_1, blue_1] = [chroma, x, 0];
		} else if (hue_tag >= 1 && hue_tag < 2) {
			[red_1, green_1, blue_1] = [x, chroma, 0];
		} else if (hue_tag >= 2 && hue_tag < 3) { 
			[red_1, green_1, blue_1] = [0, chroma, x];
		} else if (hue_tag >= 3 && hue_tag < 4) { 
			[red_1, green_1, blue_1] = [0, x, chroma];
		} else if (hue_tag >= 4 && hue_tag < 5) { 
			[red_1, green_1, blue_1] = [x, 0, chroma];
		} else if (hue_tag >= 5 && hue_tag < 6) { 
			[red_1, green_1, blue_1] = [chroma, 0, x];
		};

		let m = value - chroma;

		return [red_1 + m, green_1 + m, blue_1 + m];
	}

	function draw_line(line, rgb) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath();

		ctx.strokeStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

		ctx.moveTo(canvas.width * line[0][0], canvas.height * line[0][1]);
		ctx.lineTo(canvas.width * line[1][0], canvas.height * line[1][1]);

		ctx.stroke();
	}

	function uniform_random_direction() {
		let uniform = Math.random();
		let direction_vector = [
			Math.cos(uniform * Math.TAU),
			Math.sin(uniform * Math.TAU),
		];
		return direction_vector;
	}

	function draw() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//draw_line(line_a, [255, 255, 255]);
		//draw_line(line_b, [255, 255, 255]);


		for (let current_line_number = 0; current_line_number < WANTED_NUMBER_OF_LINES; current_line_number++) {
			let bezier_curve_portion = current_line_number / (WANTED_NUMBER_OF_LINES - 1);
			let rgb = hsv_to_rgb(
				bezier_curve_portion,
				HSV_SATURATION_VALUE,
				HSV_VALUE_VALUE,
			).map(x => 255 * x);

			let bezier_line = [
				lerp_2d(bezier_curve_portion, line_a[0], line_a[1]),
				lerp_2d(bezier_curve_portion, line_b[0], line_b[1]),
			];

			draw_line(bezier_line, rgb);
		}
	}

	function resize_window() {
		// https://stackoverflow.com/a/32119392

		let canvas = document.getElementById('canvas');

		canvas.width = window.innerWidth;
		canvas.style.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.height = window.innerHeight;

		draw();
	}

	function make_new_world() {
		line_a = [
			[Math.random(), Math.random()],
			[Math.random(), Math.random()],
		];
		line_b = [
			[Math.random(), Math.random()],
			[Math.random(), Math.random()],
		];
	}

	function main() {
		let canvas = document.getElementById('canvas');

		resize_window();
		make_new_world();

		canvas.addEventListener('click', function() {
			make_new_world();
			draw();
		});

		window.addEventListener('resize', resize_window)
	}

	window.addEventListener('load', main);
})();
