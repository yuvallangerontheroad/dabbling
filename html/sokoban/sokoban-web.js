'use strict';


(function() {
	function load_game() {
		return JSON.parse(window.localStorage.getItem('game'));
	};


	function save_game(game) {
		window.localStorage.setItem('game', JSON.stringify(game));
	};


	function main() {
		let game = load_game() || sokoban.new_game();

		let text_element = document.getElementById('text');
		text_element.innerText = sokoban.game_to_text(game);

		[
			['up', sokoban.action_step_up],
			['down', sokoban.action_step_down],
			['left', sokoban.action_step_left],
			['right', sokoban.action_step_right],
			['next_level', sokoban.action_next_level],
			['restart_level', sokoban.action_restart_level],
			['undo', sokoban.action_undo],
			['save', save_game],
		].forEach(([element_id, action_function])=>{
			let button = document.getElementById(element_id);
			console.debug(button)
			function click_handler() {
				console.debug('click: ' + element_id);
				action_function(game);
				text_element.innerText = sokoban.game_to_text(game);
			};
			button.addEventListener('click', click_handler);
		});

		[
			['new', sokoban.new_game],
			['load', load_game],
		].forEach(([element_id, action_function])=>{
			let button = document.getElementById(element_id);
			console.debug(button)
			function click_handler() {
				console.debug('click: ' + element_id);
				game = action_function();
				text_element.innerText = sokoban.game_to_text(game);
			};
			button.addEventListener('click', click_handler);
		});
	};

	window.addEventListener('load', main);
})();
