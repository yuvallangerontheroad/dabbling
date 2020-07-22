console.log('tests start');

console.log(sokoban);

let game = sokoban.new_game();
[
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_step_right,
	sokoban.action_next_level,
].forEach(action_function=>{
	let s = sokoban.game_to_text(game);
	console.log(`before:
${s}
KAKAKAKAKAKAKAKAKAKAKAKAKAKAKAKA`
	);
	action_function(game);
	s = sokoban.game_to_text(game);
	console.log(`after:
${s}
KAKAKAKAKAKAKAKAKAKAKAKAKAKAKAKA`
	);
})
sokoban.action_next_level(game);
let s = sokoban.game_to_text(game);
console.log(`after: ${s}`)
sokoban.action_next_level(game);
s = sokoban.game_to_text(game);
console.log(`after: ${s}`)
