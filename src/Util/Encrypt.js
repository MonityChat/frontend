import sjcl from 'sjcl';

const hmacSHA1 = function (key) {
	var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha1);
	this.encrypt = function () {
		return hasher.encrypt.apply(hasher, arguments);
	};
};

/**
 * Takes a string and a salt and hashes it with sha256
 * returns the hashed string 
 */
export function hash(str, salt) {
	const hashedBits = sjcl.misc.pbkdf2(str, toBits(salt), 100, 256, hmacSHA1);
	return fromBits(hashedBits);
}

export function generateNewSalt() {
	return fromBits(sjcl.random.randomWords(8));
}

/**
 * converts hex to sjcl 
 */
function toBits(input) {
	return sjcl.codec.hex.toBits(input);
}

/**
 * converts sjcl to hex 
 */
function fromBits(bits) {
	return sjcl.codec.hex.fromBits(bits);
}
