'use strict';


console.log('kakalog.js start.');


(function() {
	function change_console() {
		if (window.kakalog_activated) {
			[
				'debug',
				'error',
				'info',
				'log',
				'trace',
			].forEach(function_name=>{
				let old_function = console[function_name];
				let new_function = function(...stuff) {
					old_function(...stuff);
					let log_element = document.getElementById('log');
					let log_text = `${function_name}: ${stuff}`;
					log_element.innerText = `${log_element.innerText}\n${log_text}`;
				};
				console[function_name] = new_function;
			});
		};
	};
	
	window.addEventListener('load', change_console);
})();


console.log('kakalog.js end.');
