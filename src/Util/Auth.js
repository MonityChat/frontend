import useAuthentication from "./UseAuth";

//URL for sign in
export const AUTH_KEY_URL = 'http://localhost:8808/auth';

//URL for login into your account
export const LOGIN_URL = "http://localhost:8808/user/login";

//URL for registering a new account
export const REGISTER_URL = "http://localhost:8808/user/register";

//URL for getting the salt to encrypt the password
export const SALT_URL = 'http://localhost:8808/user/salt';

//URL for checking if the user with a specific email or username already exists
export const USER_EXISTS_URL = 'http://localhost:8808/user/exists';

//URL for reseting password
export const RESET_PASSWORD_URL = 'http://localhost:8808/user/reset-password';

//Key for making requests to the server
export const SESSION_AUTH = {
	key: null,
	isLogedIn: false,
};

//function for getting a basic session key to make requests to the server
export async function getNewKey() {
	const res = await fetch(AUTH_KEY_URL, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const { uuid } = await res.json();
	const [, setKey, , ] = useAuthentication();
	setKey(uuid);
}
