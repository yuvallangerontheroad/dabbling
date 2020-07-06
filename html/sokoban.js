'use strict';


console.log('sokoban.js start.');


let sokoban = (function() {
	let levels = [
		`
##############
#.@...*....z.#
##############
`,
		`
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
`,
	];
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
		let max_x = Math.max(...lines.map(line=>line.length));
		for (let y = 0; y < lines.length; y++) {
			state.walls[y] = [];
			state.rocks[y] = [];
			state.floors[y] = [];
			state.endings[y] = [];
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
		delete state.rocks[fy][fx];
		state.rocks[ty][tx] = '*';
	}


	function is_won(game) {
		for (let y = 0; y < game.level_state.rocks.length; y++) {
			if (game.level_state.rocks[y] != undefined) {
				for (let x = 0; x < game.level_state.rocks[y].length; x++) {
					if (here_rock(game.level_state, [x, y]) != here_ending(game.level_state, [x, y])) {
						return false;
					}
				}
			}
		}
		return true;
	};


	function action_step(game, direction) {
		if (!is_won(game)) {
			let p0 = game.level_state.position;
			let p1 = [
				p0[0] + direction[0],
				p0[1] + direction[1]];
			let p2 = [
				p1[0] + direction[0],
				p1[1] + direction[1]];

			let is_walking = here_floor(game.level_state, p1);
			let is_blocked = (
				here_wall(game.level_state, p1) || (
					here_rock(game.level_state, p1) && (
						here_rock(game.level_state, p2) ||
						here_wall(game.level_state, p2))));
			let is_pushing = (
				here_rock(game.level_state, p1) &&
				!here_rock(game.level_state, p2));

			if (!is_blocked) {
				if (is_pushing) {
					move_rock(game.level_state, p1, p2);
				};
				game.level_state.position = p1;
			};
		};
	};

	function action_step_up(game) { action_step(game, [0, -1]); };
	function action_step_down(game) { action_step(game, [0, 1]); };
	function action_step_left(game) { action_step(game, [-1, 0]); };
	function action_step_right(game) { action_step(game, [1, 0]); };


	function action_next_level(game) {
		if (is_won(game) && game.current_level_number < levels.length) {
			game.current_level_number += 1;
			game.level_state = read_level_text(levels[game.current_level_number]);
		};
	};


	function action_restart_level(game) {
		game.level_state = read_level_text(levels[game.current_level_number]);
	};


	function game_to_text(game) {
		let s = '';

		if (is_won(game)) {
			s = s.concat('Won! Press c to continue.');
		}
		s = s.concat(`Level ${game.current_level_number + 1}`);

		let max_y = Math.max(
			game.level_state.rocks.length,
			game.level_state.endings.length,
			game.level_state.floors.length,
			game.level_state.walls.length,
			game.level_state.position[1],
		);
		for (let y = 0; y < max_y; y++) {
			let max_x = Math.max(
				game.level_state.rocks[y].length,
				game.level_state.endings[y].length,
				game.level_state.floors[y].length,
				game.level_state.walls[y].length,
				game.level_state.position[0],
			);
			for (let x = 0; x < max_x; x++) {
				if (here_player(game.level_state, [x, y])) {
					s = s.concat('@');
				} else if (here_wall(game.level_state, [x, y])) {
					s = s.concat('#');
				} else if (here_rock(game.level_state, [x, y])) {
					s = s.concat('*');
				} else if (here_floor(game.level_state, [x, y])) {
					s = s.concat('.');
				} else if (here_ending(game.level_state, [x, y])) {
					s = s.concat('z');
				} else {
					s = s.concat(' ');
				}
			};
			s = s.concat('\n');
		};

		return s.trimEnd();
	};


	function load_game() {
		let game = {
			level_state: read_level_text(levels[0]),
			current_level_number: 0,
		};
		return game;
	};


	return {
		action_next_level,
		action_restart_level,
		action_step_down,
		action_step_left,
		action_step_right,
		action_step_up,
		game_to_text,
		load_game,
	};
})();


console.log('sokoban.js end.');
