'use strict;'

Math.TAU = 2 * Math.PI;

(function() {
	let start_time;
	let elapsed_time;
	let previous_timestamp;

	let polygons_vertices = [];
	let polygon_velocity = [];

	let hsv_values = [[0, 1, 0.7]];
	let color_wheel_velocity = 0.01;

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

	function move_and_bounce_1d(position, velocity, maximum_value) {
		let new_position = position + velocity;

		if (new_position > maximum_value) {
			return [2 * maximum_value - new_position, -Math.abs(velocity)];
		} else if (new_position < 0) {
			return [Math.abs(new_position), Math.abs(velocity)];
		} else {
			return [new_position, velocity];
		};

	}

	function move_and_bounce_2d(position, velocity, width, height) {
		let [position_x, velocity_x] = move_and_bounce_1d(position[0], velocity[0], width);
		let [position_y, velocity_y] = move_and_bounce_1d(position[1], velocity[1], height);

		return [
			[position_x, position_y],
			[velocity_x, velocity_y],
		];
	}

	function move_polygon(polygon_vertices, polygon_velocity) {
		for (let vertex_number = 0; vertex_number < polygon_vertices.length; vertex_number++) {
			let [new_position, new_velocity] = move_and_bounce_2d(
				polygon_vertices[vertex_number],
				polygon_velocity[vertex_number],
				canvas.width,
				canvas.height,
			);

			polygon_vertices[vertex_number] = new_position;
			polygon_velocity[vertex_number] = new_velocity;
		}
	};

	function draw_polygon(ctx, polygon_vertices, rgb) {
		ctx.beginPath();

		ctx.strokeStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

		ctx.moveTo(polygon_vertices[0][0], polygon_vertices[0][1]);

		for (let vertex_number = 1; vertex_number < polygon_vertices.length; vertex_number++) {
			ctx.lineTo(polygon_vertices[vertex_number][0], polygon_vertices[vertex_number][1]);
		}

		ctx.closePath();
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

	function step(timestamp) {
		if (start_time === undefined) {
			start_time = timestamp;
		}

		elapsed_time = timestamp - start_time;

		delta_time = timestamp - previous_timestamp;

		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (polygons_vertices.length >= 50) {
			// Remove oldest polygon, the one at position 0.
			polygons_vertices = polygons_vertices.slice(1, polygons_vertices.length);
			hsv_values = hsv_values.slice(1, hsv_values.length);
		}
		
		// Get the newest polygon at position n-1.
		let current_polygon_vertices = polygons_vertices[polygons_vertices.length - 1];
		let current_hsv_value = hsv_values[hsv_values.length - 1];

		// Clone our latest polygon.
		let new_polygon_vertices = current_polygon_vertices.map(vertex => vertex.map(axis => axis));
		let new_hsv_value = current_hsv_value.map(axis => axis);

		move_polygon(new_polygon_vertices, polygon_velocity);
		new_hsv_value[0] = (new_hsv_value[0] + color_wheel_velocity) % 1;

		polygons_vertices.push(new_polygon_vertices);
		hsv_values.push(new_hsv_value);

		for (let current_polygon = 0; current_polygon < polygons_vertices.length; current_polygon++) {
			let rgb = hsv_to_rgb(
				hsv_values[current_polygon][0],
				hsv_values[current_polygon][1],
				hsv_values[current_polygon][2],
			).map(x => 255 * x);
			draw_polygon(ctx, polygons_vertices[current_polygon], rgb);
		}

		console.info(polygons_vertices);

		previous_timestamp = timestamp;

		window.requestAnimationFrame(step)
	}

	function main() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		polygons_vertices = [[
			[canvas.width / 2, canvas.height / 3],
			[2 * canvas.width / 3, 2 * canvas.height / 3],
			[canvas.width / 3, 2 * canvas.height / 3],
		]];

		polygon_velocity = [
			uniform_random_direction(),
			uniform_random_direction(),
			uniform_random_direction(),
		].map(vertex => vertex.map(axis => 10 * axis));

		window.requestAnimationFrame(step);
	}

	window.addEventListener('load', main);
})();
