'use strict';


console.log('a');


let sokoban = (function() {
	let level1 = `
    #####
    #...#
    #*..#
  ###..*##
  #..*.*.#
###.#.##.#   ######
#...#.##.#####..zz#
#.*..*..........zz#
#####.###.#@##..zz#
    #.....#########
    #######
`;
	let level_win_test_not_all_endings = `
    #####
    #...#
    #...#
  ###...##
  #......#
###.#.##.#   ######
#...#.##.#####..zz#
#..z.*..........zz#
#####.###.#@##..zz#
    #.....#########
    #######
`;
	let level_win_test_all_endings = `
    #####
    #...#
    #...#
  ###...##
  #......#
###.#.##.#   ######
#...#.##.#####....#
#..z.*............#
#####.###.#@##....#
    #.....#########
    #######
`;

	function read_level_text(s) {
		let state = {
			rocks: [],
			walls: [],
			floors: [],
			endings: [],
		};
		let lines = s.split('\n');
		let max_x = Math.max(...lines.map(line=>line.length))
		for (let y = 0; y < lines.length; y++) {
			state.walls[y] = []
			state.rocks[y] = []
			state.floors[y] = []
			state.endings[y] = []
			for (let x = 0; x < lines[y].length; x++) {
				if (lines[y][x] == '@') {
					state.position = [x, y];
					state.floors[y][x] = '.';
				} else if (lines[y][x] == '*') {
					state.rocks[y][x] = '*';
					state.floors[y][x] = '.';
				} else if (lines[y][x] == '#') {
					state.walls[y][x] = '#';
				} else if (lines[y][x] == 'z') {
					state.endings[y][x] = 'z';
				} else if (lines[y][x] == '.') {
					state.floors[y][x] = '.';
				};
			};
		};

		return state;
	};

	function here_player(state, [x, y]) {
		return (
			state.position[0] == x &&
			state.position[1] == y
		);
	}
	function here_wall(state, [x, y]) {
		return state.walls[y][x] == '#';
	}
	function here_rock(state, [x, y]) {
		return state.rocks[y][x] == '*';
	}
	function here_ending(state, [x, y]) {
		return state.endings[y][x] == 'z';
	}
	function here_floor(state, [x, y]) {
		return state.floors[y][x] == '.';
	}
	function move_rock(state, [fx, fy], [tx, ty]) {
		console.log(fx, fy, tx, ty);
		delete state.rocks[fy][fx];
		state.rocks[ty][tx] = '*';
	}

	function step(state, direction) {
		let p0 = state.position;
		let p1 = [
			p0[0] + direction[0],
			p0[1] + direction[1]];
		let p2 = [
			p1[0] + direction[0],
			p1[1] + direction[1]];

		console.log(p0, p1, p2)

		let is_walking = here_floor(state, p1);
		let is_blocked = (
			here_wall(state, p1) || (
				here_rock(state, p1) && (
					here_rock(state, p2) ||
					here_wall(state, p2))));
		let is_pushing = (
			here_rock(state, p1) &&
			!here_rock(state, p2));

		console.log(is_walking, is_blocked, is_pushing);

		if (!is_blocked) {
			if (is_pushing) {
				move_rock(state, p1, p2);
			};
			state.position = p1;
		};
	};


	function is_win(state) {
		for (let y = 0; y < state.rocks.length; y++) {
			for (let x = 0; x < state.rocks[y].length; x++) {
				if (here_rock(state, [x, y]) != here_ending(state, [x, y])) {
					return false;
				}
			}
		}
		return true;
	};


	function state_to_text(state) {
		let s = '';
		let max_y = Math.max(
			state.rocks.length,
			state.endings.length,
			state.floors.length,
			state.walls.length,
			state.position[1],
		);
		for (let y = 0; y < max_y; y++) {
			let max_x = Math.max(
				state.rocks[y].length,
				state.endings[y].length,
				state.floors[y].length,
				state.walls[y].length,
				state.position[0],
			);
			for (let x = 0; x < max_x; x++) {
				if (here_player(state, [x, y])) {
					s = s.concat('@');
				} else if (here_wall(state, [x, y])) {
					s = s.concat('#');
				} else if (here_rock(state, [x, y])) {
					s = s.concat('*');
				} else if (here_floor(state, [x, y])) {
					s = s.concat('.');
				} else if (here_ending(state, [x, y])) {
					s = s.concat('z');
				} else {
					s = s.concat(' ');
				}
			};
			s = s.concat('\n');
		};

		return s;
	};

	let state = read_level_text(level1);
	[
		[0, -1],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
		[-1, 0],
	].forEach(
		direction=>{
			step(state, direction);
			console.log(state_to_text(state));
			console.log(is_win(state));
		}
	);
})();
