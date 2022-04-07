Math.TAU = 2 * Math.PI;

(function() {
	let turn = 0;
	let last_time = 0;
	const NUMBER_OF_POLYGONS = 7;
	const POLYGON_HEIGHT_MARGIN = 0.075;
	const TURN_PER_MILLISECOND = 0.0005;
	const CYCLE_LENGTH = 20;
	const NUMBER_OF_SAMPLES = 300;

	const functions = [
		turn => step_on(turn % CYCLE_LENGTH, 1, 1.5) - step_on(turn % CYCLE_LENGTH, 2, 2.5) +
			step_on(turn % CYCLE_LENGTH, 3, 3.5) - step_on(turn % CYCLE_LENGTH, 4, 4.5) +
			step_on(turn % CYCLE_LENGTH, 5, 5.5) - step_on(turn % CYCLE_LENGTH, 6, 6.5) +

			step_on(turn % CYCLE_LENGTH, 7, 7.5) - step_on(turn % CYCLE_LENGTH, 8.5, 9) +
			step_on(turn % CYCLE_LENGTH, 9.5, 10) - step_on(turn % CYCLE_LENGTH, 11, 11.5) +
			step_on(turn % CYCLE_LENGTH, 12, 12.5) - step_on(turn % CYCLE_LENGTH, 13.5, 14) +

			step_on(turn % CYCLE_LENGTH, 14.5, 15) - step_on(turn % CYCLE_LENGTH, 15.5, 16) +
			step_on(turn % CYCLE_LENGTH, 16.5, 17) - step_on(turn % CYCLE_LENGTH, 17.5, 18) +
			step_on(turn % CYCLE_LENGTH, 18.5, 19) - step_on(turn % CYCLE_LENGTH, 19.5, 20),
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

	function draw() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.fillStyle='black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.strokeStyle = 'white';

		let start_t = -1;
		let end_t = CYCLE_LENGTH;


		ctx.moveTo(start_t, quadratic_stepper(-1) * canvas.width);

		let ts = linspace(start_t, end_t, NUMBER_OF_SAMPLES);

		ctx.lineWidth = 2;

		// [50, h - 50]
		// 0, 1, 2 / /n-1
		// 0, 0.5, 1 / *(h-h0.1)
		// 0, 0.5(0.9h), 0.9h / +h0.05
		// 50, 0.5(h-100)+0.05h, 0.9h+0.05h
		for (let polygon_i = 0; polygon_i < NUMBER_OF_POLYGONS; polygon_i++) {
			let y_top = polygon_i * canvas.height / NUMBER_OF_POLYGONS;
			let y_bottom = (polygon_i + 1) * canvas.height / NUMBER_OF_POLYGONS;

			let ys = ts.map(functions[0]);

			let canvas_ts = ts.map(t => superlerp(t, start_t, end_t, 0, canvas.width));
			let canvas_ys = ys.map(y => superlerp(y, -0.2, 1.2, y_bottom, y_top))

			/*
			let canvas_points = ys.map(
				t => from_math_coordinates_to_canvas_coordinates(
					t,
					step_on_step_off(t, -0.5, 0, 0.5, 1),
					[-1, 2],
					[-1, 2],
				)
			);
			*/
			ctx.moveTo(canvas_ts[0], canvas_ys[0]);
			for (let point_i = 1; point_i < NUMBER_OF_SAMPLES; point_i++) {
				ctx.lineTo(canvas_ts[point_i], canvas_ys[point_i]);
			}
			ctx.stroke();

			let polygon_y = superlerp(
				polygon_i,
				0,
				NUMBER_OF_POLYGONS - 1,
				POLYGON_HEIGHT_MARGIN * canvas.height,
				canvas.height * (1 - POLYGON_HEIGHT_MARGIN),
			);

			let current_math_t = turn % CYCLE_LENGTH;
			let current_canvas_t = superlerp(current_math_t, start_t, end_t, 0, canvas.width);
			let current_math_y = functions[0](current_math_t);
			let current_canvas_y = superlerp(current_math_y, -0.2, 1.2, y_bottom, y_top);

			ctx.stroke(
				make_regular_polygon_path2d(
					canvas.width / 2,
					polygon_y,
					20 * canvas.height / 500,
					polygon_i + 3,
					current_math_y,
				),
			);

			ctx.moveTo(current_canvas_t, current_canvas_y);

			ctx.arc(current_canvas_t, current_canvas_y, canvas.height / 80, 0, Math.TAU, false);
			ctx.stroke();
		}
	}

	function step(time_since_start) {
		draw();

		turn = TURN_PER_MILLISECOND * time_since_start;

		window.requestAnimationFrame(step);
	}

	function main() {
		window.requestAnimationFrame(step);
	}

	window.addEventListener('load', main);
})();
