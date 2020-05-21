module.exports = function() {
	var e = new Error(), frame;
	if (!e.stack) {
		try {
			throw e;
		} catch (e) {
			if (!e.stack) {
				return 0; // IE < 10, likely
			}
		}
	}
	var stack = e.stack.toString().split(/\r\n|\n/);
	// We want our caller's frame. It's index into |stack| depends on the
	// browser and browser version, so we need to search for the second frame:
	var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
	do {
		frame = stack.shift();
	} while (!frameRE.exec(frame) && stack.length);
	return frameRE.exec(stack.shift())[1];
};