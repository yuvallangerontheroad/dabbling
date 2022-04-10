Math.TAU = 2 * Math.PI;

(function() {
	let turn = 0;
	let last_time = 0;
	let math_ts;
	let math_yss;
	let math_polygon_radiuses;
	let canvas_ts;
	let canvas_yss;
	let canvas_polygon_radiuses;

	const NUMBER_OF_POLYGONS = 7;
	const POLYGON_HEIGHT_MARGIN = 0.075;
	const TURN_PER_MILLISECOND = 0.0005;
	const CYCLE_LENGTH = 20;
	const NUMBER_OF_SAMPLES = 500;
	const START_T = 0;
	const END_T = CYCLE_LENGTH;
	const math_graph_y_extents = [
		[-1.2, 1.2],
		[-1.2, 1.2],
		[-1.2, 1.2],
		[-1.2, 1.2],
		[-1.2, 1.2],
		[-1.2, 1.2],
		[-1.2, 1.2],
	];



	const functions = [
		/*
		turn => step_on(turn % CYCLE_LENGTH, 1, 1.5) - step_on(turn % CYCLE_LENGTH, 2, 2.5) +
			step_on(turn % CYCLE_LENGTH, 3, 3.5) - step_on(turn % CYCLE_LENGTH, 4, 4.5) +
			step_on(turn % CYCLE_LENGTH, 5, 5.5) - step_on(turn % CYCLE_LENGTH, 6, 6.5) +

			step_on(turn % CYCLE_LENGTH, 7, 7.5) - step_on(turn % CYCLE_LENGTH, 8.5, 9) +
			step_on(turn % CYCLE_LENGTH, 9.5, 10) - step_on(turn % CYCLE_LENGTH, 11, 11.5) +
			step_on(turn % CYCLE_LENGTH, 12, 12.5) - step_on(turn % CYCLE_LENGTH, 13.5, 14) +

			step_on(turn % CYCLE_LENGTH, 14.5, 15) - step_on(turn % CYCLE_LENGTH, 15.5, 16) +
			step_on(turn % CYCLE_LENGTH, 16.5, 17) - step_on(turn % CYCLE_LENGTH, 17.5, 18) +
			step_on(turn % CYCLE_LENGTH, 18.5, 19) - step_on(turn % CYCLE_LENGTH, 19.5, 20),
		*/
		turn => Math.sin(turn * Math.TAU / 20 * 7),
		turn => Math.sin(turn * Math.TAU / 20 * 6),
		turn => Math.sin(turn * Math.TAU / 20 * 5),
		turn => Math.sin(turn * Math.TAU / 20 * 4),
		turn => Math.sin(turn * Math.TAU / 20 * 3),
		turn => Math.sin(turn * Math.TAU / 20 * 2),
		turn => Math.sin(turn * Math.TAU / 20),
	];

	function quadratic_stepper(t) {
		if (t < 0) {
			return 0;
		} else if (t < 0.5) {
			return 2 * t**2;
		} else if (t < 1) {
			return (-2*((t-1)**2) + 1);
		} else {
			return 1;
		}
	}
	
	function lerp(t, a, b) {
		return (b - a) * t + a;
	}

	function superlerp(t, a, b, c, d) {
		// [a, b] ; -a
		// [0, b-a] ; /(b-a)
		// [0, 1] ; *(d-c)
		// [0, d-c] ; +c
		// [c, d]
		return (t - a) / (b - a) * (d - c) + c;
	}

	function step_on(t, a, b) {
		return quadratic_stepper(superlerp(t, a, b, 0, 1));
	}

	function step_on_step_off(t, a, b, c, d) {
		return step_on(t, a, b) - step_on(t, c, d);
	}

	function from_math_coordinates_to_canvas_coordinates(x, y, x_extents, y_extents) {
		let canvas = document.getElementById('canvas');

		// a, b / - a
		// 0, b-a / * w
		// 0, (b-a)w / /(b-a)
		// 0, w
		
		// a, b / *(-1)
		// -b, -a / +b
		// 0, (b-a) / * h
		// 0, (b-a)h / /(b-a)
		// 0, h
		
		return [
			(x - x_extents[0]) * canvas.width / (x_extents[1] - x_extents[0]),
			((-y) + y_extents[1]) * canvas.height / (y_extents[1] - y_extents[0]),
		];
	}

	function make_regular_polygon_path2d(x, y, radius, number_of_sides, turn) {
		// `x` and `y` are the center of the triangle.
		// `radius` is the distance from the center to a vertex.
		// `number_of_sides` of the polygon.
		// `turn` is a value [0, 1] where 1 is a full turn.
		
		let regular_polygon = new Path2D();
		
		regular_polygon.moveTo(
			x + Math.cos(turn * Math.TAU) * radius,
			y + Math.sin(turn * Math.TAU) * radius,
		);

		for (let vertex_i = 1; vertex_i < number_of_sides; vertex_i++) {
			regular_polygon.lineTo(
				x + Math.cos((vertex_i / number_of_sides + turn) * Math.TAU) * radius,
				y + Math.sin((vertex_i / number_of_sides + turn) * Math.TAU) * radius,
			);
		}

		regular_polygon.closePath();

		return regular_polygon;
	}

	function linspace(start, stop, number_of_points) {
		let l = [];
		for (let point_i = 0; point_i < number_of_points; point_i++) {
			l.push(superlerp(point_i, 0, number_of_points - 1, start, stop));
		}
		return l;
	}

	function draw_polygon(number_of_sides, turn, polygon_center_y, polygon_radius_addition) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath()
		ctx.fillStyle = '#f0f'; // Fuchia from https://www.w3schools.com/colors/colors_names.asp
		ctx.strokeStyle = '#f0f';
		ctx.fill(
			make_regular_polygon_path2d(
				canvas.width / 2,
				polygon_center_y,
				20 * canvas.height / 500 + polygon_radius_addition,
				number_of_sides,
				turn,
			),
		);
		ctx.stroke(
			make_regular_polygon_path2d(
				canvas.width / 2,
				polygon_center_y,
				20 * canvas.height / 500 + polygon_radius_addition,
				number_of_sides,
				turn,
			),
		);
	}

	function draw_graph(polygon_i) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath()
		ctx.strokeStyle = 'white';
		ctx.moveTo(canvas_ts[0], canvas_yss[polygon_i][0]);
		for (let point_i = 1; point_i < NUMBER_OF_SAMPLES; point_i++) {
			ctx.lineTo(canvas_ts[point_i], canvas_yss[polygon_i][point_i]);
		}
		ctx.stroke();
	}

	function draw_position_circle(x, y) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.fillStyle = "#00bfff"; // DeepSkyBlue from https://www.w3schools.com/colors/colors_names.asp
		ctx.arc(x, y, canvas.height / 80, 0, Math.TAU, false);
		ctx.fill();
	}

	function draw() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.fillStyle='black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.strokeStyle = 'white';

		//ctx.moveTo(START_T, functions[polygon_i](-1) * canvas.width);

		ctx.lineWidth = 2;

		// [50, h - 50]
		// 0, 1, 2 / /n-1
		// 0, 0.5, 1 / *(h-h0.1)
		// 0, 0.5(0.9h), 0.9h / +h0.05
		// 50, 0.5(h-100)+0.05h, 0.9h+0.05h
		for (let polygon_i = 0; polygon_i < NUMBER_OF_POLYGONS; polygon_i++) {
			// top and bottom of the are dedicated to this graph.
			let y_top = polygon_i * canvas.height / NUMBER_OF_POLYGONS;
			let y_bottom = (polygon_i + 1) * canvas.height / NUMBER_OF_POLYGONS;

			// the vertical value of the center of the current polygon.
			let polygon_y = superlerp(
				polygon_i,
				0,
				NUMBER_OF_POLYGONS - 1,
				POLYGON_HEIGHT_MARGIN * canvas.height,
				canvas.height * (1 - POLYGON_HEIGHT_MARGIN),
			);

			// Get all cached values of the mathematical and graphical
			let current_sample_i = Math.floor(turn / CYCLE_LENGTH * canvas_ts.length) % canvas_ts.length;
			let current_math_t = math_ts[current_sample_i]; //superlerp(current_math_t, START_T, END_T, 0, canvas.width);
			let current_canvas_t = canvas_ts[current_sample_i];
			let current_math_y = math_yss[polygon_i][current_sample_i];
			//let current_math_y = functions[1](current_math_t);
			let current_canvas_y = canvas_yss[polygon_i][current_sample_i]; // superlerp(current_math_y, -1.2, 1.2, y_bottom, y_top);

			draw_graph(polygon_i);

			draw_polygon(polygon_i + 3, current_math_y, polygon_y, canvas_polygon_radiuses[polygon_i][current_sample_i]);

			draw_position_circle(current_canvas_t, current_canvas_y);
		}
	}

	function step(time_since_start) {
		draw();

		turn = TURN_PER_MILLISECOND * time_since_start;

		window.requestAnimationFrame(step);
	}

	function resize_window() {
		// https://stackoverflow.com/a/32119392

		let canvas = document.getElementById('canvas');

		canvas.width = window.innerWidth;
		canvas.style.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.height = window.innerHeight;

		cache_canvas_data();
	}

	function cache_math_data() {
		math_ts = Float32Array.from(linspace(START_T, END_T, NUMBER_OF_SAMPLES));
		math_yss = [];
		math_polygon_radiuses = [];
		for (let polygon_i = 0; polygon_i < NUMBER_OF_POLYGONS; polygon_i++) {
			math_yss.push(Float32Array.from(math_ts));
			for (let t_i = 0; t_i < math_ts.length; t_i++) {
				let y = functions[polygon_i](math_ts[t_i]);
				math_yss[polygon_i][t_i] = y;
			}
			math_polygon_radiuses[polygon_i] = math_yss[polygon_i].map(y => (y > 0.7) ? (y - 0.7) : 0);
		}
	}

	function cache_canvas_data() {
		let canvas = document.getElementById('canvas');

		canvas_yss = [];
		canvas_polygon_radiuses = [];
		for (let polygon_i = 0; polygon_i < NUMBER_OF_POLYGONS; polygon_i++) {
			let y_top = polygon_i * canvas.height / NUMBER_OF_POLYGONS;
			let y_bottom = (polygon_i + 1) * canvas.height / NUMBER_OF_POLYGONS;

			canvas_ts = math_ts.map(t => superlerp(t, START_T, END_T, 0, canvas.width));
			canvas_yss[polygon_i] = math_yss[polygon_i].map(
				y => superlerp(
					y,
					math_graph_y_extents[polygon_i][0],
					math_graph_y_extents[polygon_i][1],
					y_bottom, y_top));
			canvas_polygon_radiuses[polygon_i] = math_polygon_radiuses[polygon_i].map(x => x * (canvas.height / 500) * 100)
		}
	}

	function main() {
		cache_math_data();
		resize_window();

		window.addEventListener('resize', resize_window)
		window.requestAnimationFrame(step);
	}

	window.addEventListener('load', main);
})();
