import sjcl, { BitArray } from 'sjcl';

const hmacSHA1 = function (key) {
	var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha1);
	this.encrypt = function () {
		return hasher.encrypt.apply(hasher, arguments);
	};
};

/**
 * Takes a string and a salt and hashes it with sha256
 * returns the hashed string
 * @param {String} string to hash
 * @param {String} salt to salt the password with
 * @returns {String} a hashed password
 */
export function hash(string, salt) {
	const hashedBits = sjcl.misc.pbkdf2(
		string,
		toBits(salt),
		100,
		256,
		hmacSHA1
	);
	return fromBits(hashedBits);
}

/**
 * Generates a new Salt in String format
 * @returns {String} the new salt
 */
export function generateNewSalt() {
	return fromBits(sjcl.random.randomWords(8));
}

/**
 * Converts String to sjcl BitArray
 * @param {String} string to convert
 * @returns {BitArray} BitArray of the given input
 */
function toBits(string) {
	return sjcl.codec.hex.toBits(string);
}

/**
 * Converts sjcl BitArray to String 
 * @param {BitArray} bits to convert
 * @returns {String} String of the given input
 */
function fromBits(bits) {
	return sjcl.codec.hex.fromBits(bits);
}
