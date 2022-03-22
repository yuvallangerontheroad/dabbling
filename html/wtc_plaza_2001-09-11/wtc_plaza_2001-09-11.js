'use strict';

// Why is it not part of the standard yet?
Math.TAU = 2 * Math.PI;

(function() {
	let audio_context;
	let scream_audio_data;
	let thump_audio_data;

	let BLOOD_COLOR = (0, 0, 255, 255);
	let STICK_FIGURE_COLOR = (0, 0, 0, 255);

	function lerp(portion, start, stop) {
		return portion * (stop - start) + start;
	}

	function make_random_direction() {
	    let uniform = Math.random();
	    return [
		Math.cos(Math.TAU * uniform),
		Math.sin(Math.TAU * uniform),
	    ];
	};

	function add_random_position(original_position, distance) {
	    let new_direction = make_random_direction();

	    return [
		    original_position[0] + distance * new_direction[0],
		    original_position[1] + distance * new_direction[1],
	    ];
	}

	function make_random_stick_figure_positions() {
	    let head_neck_distance = 0.05;
	    let elbow_neck_distance = 0.050;
	    let arm_tip_elbow_distance = 0.050;
	    let pelvis_neck_distance = 0.125;
	    let knee_pelvis_distance = 0.075;
	    let leg_tip_knee_distance = 0.075;

	    let head_position = [Math.random(), Math.random()];

	    let neck_position = add_random_position(head_position, head_neck_distance);

	    let left_elbow_position = add_random_position(neck_position, elbow_neck_distance);
	    let right_elbow_position = add_random_position(neck_position, elbow_neck_distance);

	    let left_arm_tip_position = add_random_position(left_elbow_position, arm_tip_elbow_distance);
	    let right_arm_tip_position = add_random_position(right_elbow_position, arm_tip_elbow_distance);

	    let pelvis_position = add_random_position(neck_position, pelvis_neck_distance);

	    let left_knee_position = add_random_position(pelvis_position, knee_pelvis_distance);
	    let right_knee_position = add_random_position(pelvis_position, knee_pelvis_distance);

	    let left_leg_top_position = add_random_position(left_knee_position, leg_tip_knee_distance);
	    let right_leg_top_position = add_random_position(right_knee_position, leg_tip_knee_distance);

	    return [
		    head_position,
		    neck_position,
		    left_elbow_position,
		    right_elbow_position,
		    left_arm_tip_position,
		    right_arm_tip_position,
		    pelvis_position,
		    left_knee_position,
		    right_knee_position,
		    left_leg_top_position,
		    right_leg_top_position,
	    ];
	}




	function make_blood_splatter_positions(stick_figure_positions) {
	    let blood_splatter_positions = [];

	    for (let i = 0; i < 3; i++) {
		    blood_splatter_positions.push(
			    add_random_position(stick_figure_positions[1], 0.05 * (i + 1))
		    );
	    }

	    for (let i = 0; i < 3; i++) {
		    blood_splatter_positions.push(
			    add_random_position(stick_figure_positions[6], 0.05 * (i + 1))
		    );
	    }

		return blood_splatter_positions;
	}

	function draw_blood_splatter(blood_splatter_positions) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		let image_width = ctx.canvas.width;
		let image_height = ctx.canvas.height;

	    let blood_splatter_positions_in_image = blood_splatter_positions.map(
		    position => [
			    Math.floor(position[0] * image_width),
			    Math.floor(position[1] * image_height),
		    ]
	    );


		ctx.fillStyle = '#f00';

		ctx.beginPath();
	    ctx.arc(blood_splatter_positions_in_image[0][0], blood_splatter_positions_in_image[0][1], 20, 0, Math.TAU);
		ctx.fill();

		ctx.beginPath();
	    ctx.arc(blood_splatter_positions_in_image[1][0], blood_splatter_positions_in_image[1][1], 10, 0, Math.TAU);
		ctx.fill();

		ctx.beginPath();
	    ctx.arc(blood_splatter_positions_in_image[2][0], blood_splatter_positions_in_image[2][1], 5, 0, Math.TAU);
		ctx.fill();

		ctx.beginPath();
	    ctx.arc(blood_splatter_positions_in_image[3][0], blood_splatter_positions_in_image[3][1], 20, 0, Math.TAU);
		ctx.fill();

		ctx.beginPath();
	    ctx.arc(blood_splatter_positions_in_image[4][0], blood_splatter_positions_in_image[4][1], 10, 0, Math.TAU);
		ctx.fill();

		ctx.beginPath();
	    ctx.arc(blood_splatter_positions_in_image[5][0], blood_splatter_positions_in_image[5][1], 5, 0, Math.TAU);
		ctx.fill();

		ctx.fill()
	}


	function draw_stick_figure(stick_figure_positions) {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

	    let image_width = ctx.canvas.width;
	    let image_height = ctx.canvas.height;

	    let stick_figure_positions_in_image = stick_figure_positions.map(
		    x => [
			    Math.floor(x[0] * image_width),
			    Math.floor(x[1] * image_height),
		    ]
	    );
		console.debug(stick_figure_positions_in_image)

		ctx.fillStyle = '#000';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;

		ctx.beginPath();
	    ctx.arc(
		    stick_figure_positions_in_image[0][0],
		    stick_figure_positions_in_image[0][1],
		    15,
		    0,
		    Math.TAU,
		    false);
		ctx.fill();

	    let connections = [
		[0, 1],
		[1, 2],
		[1, 3],
		[2, 4],
		[3, 5],
		[1, 6],
		[7, 6],
		[8, 6],
		[7, 9],
		[8, 10],
	    ];
		for (let i = 0; i < connections.length; i++) {
			ctx.beginPath();
			let origin_coordinates = stick_figure_positions_in_image[connections[i][0]];
			let destination_coordinates = stick_figure_positions_in_image[connections[i][1]];
			console.debug([origin_coordinates, destination_coordinates])
			ctx.moveTo(origin_coordinates[0], origin_coordinates[1]);
			ctx.lineTo(destination_coordinates[0], destination_coordinates[1]);
			ctx.stroke();
		}
	}

	function draw_jumper() {
		let stick_figure_positions = make_random_stick_figure_positions();
		let blood_splatter_positions = make_blood_splatter_positions(stick_figure_positions);

		console.debug(stick_figure_positions);
		console.debug(blood_splatter_positions);

		draw_blood_splatter(blood_splatter_positions);
		draw_stick_figure(stick_figure_positions);
	}


	function jump() {
		let scream_rate_fraction = lerp(Math.random(), 0.90, 1.45);
		let scream_audio_buffer = make_audio_buffer(scream_audio_data, scream_rate_fraction);
		let scream_source = make_audio_buffer_source(scream_audio_buffer);
		scream_source.start();

		setTimeout(function() {
			scream_source.stop();

			let thump_audio_buffer = make_audio_buffer(thump_audio_data, 1);
			let thump_audio_source = make_audio_buffer_source(thump_audio_buffer);

			thump_audio_source.currentTime = 0.2;

			thump_audio_source.start()

			draw_jumper();
		}, 1700.0 / scream_rate_fraction);
	}

	function clear_canvas() {
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	async function get_audio_data(audio_file_path) {
		let response = await fetch(audio_file_path);

		let array_buffer = await response.arrayBuffer();

		return await audio_context.decodeAudioData(array_buffer);
	}

	function make_audio_buffer(audio_data, sample_rate_fraction) {
		let audio_buffer = audio_context.createBuffer(
			audio_data.numberOfChannels,
			audio_data.getChannelData(0).length,
			audio_data.sampleRate * sample_rate_fraction,
		);

		for (let channel_number = 0; channel_number < audio_buffer.numberOfChannels; channel_number++) {
			let current_buffer = audio_buffer.getChannelData(channel_number);
			let audio_data_channel = audio_data.getChannelData(channel_number);

			for (let sample_number = 0; sample_number < current_buffer.length; sample_number++) {
				current_buffer[sample_number] = audio_data_channel[sample_number];
			}
		}

		return audio_buffer;
	}

	function make_audio_buffer_source(audio_buffer) {
		let buffer_source = audio_context.createBufferSource();

		buffer_source.buffer = audio_buffer;

		buffer_source.connect(audio_context.destination);

		return buffer_source;
	}

	async function main() {
		audio_context = new AudioContext();

		let scream_audio_element = document.getElementById('scream_audio');
		let thump_audio_element = document.getElementById('thump_audio');

		scream_audio_data = await get_audio_data(scream_audio_element.src);
		thump_audio_data = await get_audio_data(thump_audio_element.src);

		let canvas = document.getElementById('canvas');
		canvas.addEventListener('click', jump);

		let jump_button = document.getElementById('jump_button');
		jump_button.addEventListener('click', jump);

		let clear_button = document.getElementById('clear_button');
		clear_button.addEventListener('click', clear_canvas);
	}

	window.addEventListener('load', main);
})();
