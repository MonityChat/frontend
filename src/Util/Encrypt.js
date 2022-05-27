import sjcl from 'sjcl';
import sha1 from 'sha1';

const hmacSHA1 = function (key) {
	var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha1);
	this.encrypt = function () {
		return hasher.encrypt.apply(hasher, arguments);
	};
};

export function hash(str, salt) {
	const hashedBits = sjcl.misc.pbkdf2(str, toBits(salt), 100, 256, hmacSHA1);
	return fromBits(hashedBits);
}

export function generateNewSalt() {
	return fromBits(sjcl.random.randomWords(8));
}

function toBits(input) {
	return sjcl.codec.hex.toBits(input);
}

function fromBits(bits) {
	return sjcl.codec.hex.fromBits(bits);
}
