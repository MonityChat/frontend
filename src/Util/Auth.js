import useAuthentication from '../Hooks/UseAuth';

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
