import useAuthentication from '../Hooks/UseAuth';

/**URL for getting a key
 * @deprecated
 */
export const AUTH_KEY_URL = `${prefixDOMAIN}${DOMAIN}/auth`;

/**URL for login into your account
 * @deprecated
 */
export const LOGIN_URL = `${prefixDOMAIN}${DOMAIN}/user/login`;

/**URL for registering a new account
 * @deprecated
 */
export const REGISTER_URL = `${prefixDOMAIN}${DOMAIN}/user/register`;

/**URL for getting the salt to encrypt the password
 * @deprecated
 */
export const SALT_URL = `${prefixDOMAIN}${DOMAIN}/user/salt`;

/**URL for checking if the user with a specific email or username already exists
 * @deprecated
 */
export const USER_EXISTS_URL = `${prefixDOMAIN}${DOMAIN}/user/exists`;

/**URL for requesting reseting password
 * @deprecated
 */
export const REQEUST_RESET_PASSWORD_URL = `${prefixDOMAIN}${DOMAIN}/user/reset`;

/**URL for password reset
 * @deprecated
 */
export const RESET_PASSWORD_URL = `${prefixDOMAIN}${DOMAIN}/user/resetConfirm`;

/**
 * Returns a basic session key to make requests to the server
 * @returns {String} uuid for authentication with the server
 */
export async function getNewKey() {
	const res = await fetch(AUTHENTICATION_URL.NEW_KEY, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const { uuid } = await res.json();
	const [, setKey, ,] = useAuthentication();
	setKey(uuid);
	return uuid;
}

const URL_PREFIX = `${prefixDOMAIN}${DOMAIN}`;

const AUTHENTICATION_URL = {
	PASSWORD: {
		RESET_CONFIRM: `${URL_PREFIX}/user/resetConfirm`,
		RESET_REQUEST: `${URL_PREFIX}/user/reset`,
	},
	USER_EXISTS: `${URL_PREFIX}/user/exists`,
	GET_SALT: `${URL_PREFIX}/user/salt`,
	LOGIN: `${URL_PREFIX}/user/login`,
	REGISTER: `${URL_PREFIX}/user/register`,
	NEW_KEY: `${URL_PREFIX}/auth`,
};

export default AUTHENTICATION_URL;
