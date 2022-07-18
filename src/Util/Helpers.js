/**
 * RegEx to detect a valid emails
 */
const EMAIL_REGEX =
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

/**
 * RegEx to detect a valid password
 */
const PASSWORD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;

/**
 * Delays a functin as long as it isnt invoked within the given delay
 * @param {Function} callback function to get called after the delay
 * @param {Int} delay in millisecods. Default 700
 * @returns {Function} to call on every input
 */
export const debounce = (callback, delay = 700) => {
	let timeout;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

/**
 * Checks an email if it has a valid format using the predefined email regex @see {@link EMAIL_REGEX}
 * @param {String} email to check
 * @returns {Boolean} wheater the email is valid
 */
export const isValidEmail = (email) => {
	return email.match(EMAIL_REGEX) != null;
};

/**
 * Checks a password if it has a valid format using the predefined password regex @see {@link PASSWORD_REGEX}
 * @param {String} password to check
 * @returns {Boolean} wheater the password is valid
 */
export const isValidPassword = (password) => {
	return password.match(PASSWORD_REGEX) != null;
}
