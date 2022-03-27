Math.TAU = 2 * Math.PI;

(function() {
	let turn = 0;

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
	
	function lerp(p, a, b) {
		return (b - a) * p + a;
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

	function draw() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.beginPath();
		ctx.fillStyle='black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.strokeStyle = 'white';

		let start_t = -1;
		let end_t = 2

		ctx.moveTo(start_t, quadratic_stepper(-1) * canvas.width);

		for (let t = start_t; t <= 2; t += 0.05) {
			let [x, y] = from_math_coordinates_to_canvas_coordinates(
				t,
				quadratic_stepper(t),
				[-1, 2],
				[-1, 2],
			);
			ctx.lineTo(x, y);
			console.info(x, y, t, quadratic_stepper(t));
		}

		ctx.stroke();

		ctx.lineWidth = 3;

		for (let poop = 0; poop < 5; poop++) {
			ctx.stroke(make_regular_polygon_path2d(canvas.width / 2, 100 * poop + 50, 30, poop + 3, turn));
		}
	}

	function step() {
		turn = (turn + 0.01) % 1;
		draw();
		window.requestAnimationFrame(step);
	}

	function main() {
		draw();

		window.requestAnimationFrame(step);
	}

	window.addEventListener('load', main);
})();
