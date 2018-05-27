const DEBUG_MODE = false;

export function log(...args) {
	if (DEBUG_MODE) {
		console.log(...args);
	}
}