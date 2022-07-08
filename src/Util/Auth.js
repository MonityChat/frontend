import useAuthentication from "./UseAuth";

//URL for getting a key
export const AUTH_KEY_URL = `${prefixDOMAIN}${DOMAIN}/auth`;

//URL for login into your account
export const LOGIN_URL = `${prefixDOMAIN}${DOMAIN}/user/login`;

//URL for registering a new account
export const REGISTER_URL = `${prefixDOMAIN}${DOMAIN}/user/register`;

//URL for getting the salt to encrypt the password
export const SALT_URL = `${prefixDOMAIN}${DOMAIN}/user/salt`;

//URL for checking if the user with a specific email or username already exists
export const USER_EXISTS_URL = `${prefixDOMAIN}${DOMAIN}/user/exists`;

//URL for requesting reseting password
export const REQEUST_RESET_PASSWORD_URL = `${prefixDOMAIN}${DOMAIN}/user/reset`;

//URL for password reset
export const RESET_PASSWORD_URL = `${prefixDOMAIN}${DOMAIN}/user/resetConfirm`;

/**
 * Function for getting a basic session key to make requests to the server
 */
export async function getNewKey() {
  const res = await fetch(AUTH_KEY_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const { uuid } = await res.json();
  const [, setKey, ,] = useAuthentication();
  setKey(uuid);
}
