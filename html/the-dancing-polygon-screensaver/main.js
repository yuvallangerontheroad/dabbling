Math.TAU = 2 * Math.PI;

(function() {
	let polygon_vertices = [];
	let polygon_velocity = [];

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

	function draw_polygon(ctx, polygon_vertices) {
		ctx.beginPath();

		ctx.strokeStyle = "black";

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

	function step(e) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');


		ctx.clearRect(0, 0, canvas.width, canvas.height);

		move_polygon(polygon_vertices, polygon_velocity);

		draw_polygon(ctx, polygon_vertices);
		
		window.requestAnimationFrame(step)
	}

	function main() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		polygon_vertices = [
			[canvas.width / 2, canvas.height / 3],
			[2 * canvas.width / 3, 2 * canvas.height / 3],
			[canvas.width / 3, 2 * canvas.height / 3],
		];

		polygon_velocity = [
			uniform_random_direction(),
			uniform_random_direction(),
			uniform_random_direction(),
		];

		draw_polygon(ctx, polygon_vertices);

		move_polygon(polygon_vertices, polygon_velocity);

		window.requestAnimationFrame(step);
	}

	window.addEventListener('load', main);
})();
