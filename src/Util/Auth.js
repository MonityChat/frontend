//URL for sign in
export const SIGNIN_URL_AUTH = 'http://localhost:8808/auth';

//URL for getting the salt to encrypt the password
export const SALT_URL = 'http://localhost:8808/user/salt';

//URL for checking if the user with a specific email or username already exists
export const USER_EXISTS_URL = 'http://localhost:8808/user/exists';

//Key for making requests to the server
export const SESSION_AUTH = {
	key: null,
};

//function for getting a basic session key to make requests to the server
export async function getNewKey() {
	const res = await fetch(SIGNIN_URL_AUTH, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const { uuid } = await res.json();
	AUTH.key = uuid;
}
