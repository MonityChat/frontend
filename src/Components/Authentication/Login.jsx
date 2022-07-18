import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useAuthentication from '../../Hooks/UseAuth';
import { hash } from '../../Util/Encryption';
import { isValidEmail } from '../../Util/Helpers';
import AUTHENTICATION_URL from './../../Util/Auth';
import ERROR from './../../Util/Errors';
import { Toast } from './../../Util/Toast';
import './Css/Login.css';
import PasswordField from './PasswordField';
import Fetch, { HTTP_METHOD } from './../../Util/Fetch';

/**
 * Component to display a login field. It lets you enter an email/username and password.
 *  After pressing the login button, it will first check if the user exists.
 *  If so, it will hash the password and sent the data to the server.
 *  If it was the right password,
 *  it will redirect you to the chat with an updated authentication key.
 */
export default function Login() {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const userNameRef = useRef();
	const history = useHistory();

	const userNameInput = (e) => {
		e.target.classList.remove('error');
		setUserName(e.target.value);
	};

	const handleLogin = async () => {
		setPasswordError(false);
		setMessage('');

		if (userName.length < 1 || password.length < 1) {
			setMessage('Please enter a username and a password');
			userName.length < 1 && userNameRef.current.classList.add('error');
			password.length < 1 && setPasswordError(true);
			return;
		}

		if (!(await userExists(userName))) {
			setMessage('Invalid username or Email');
			userNameRef.current.classList.add('error');
			return;
		}

		const result = await login(userName, password);

		localStorage.setItem('userName', userName);

		if (result === ERROR.INVALID_PASSWORD) {
			setMessage('Invalid password');
			setPasswordError(true);
			return;
		}
		setMessage('Successfully loged in');
		Toast.success('You will be redirected soon.').send();

		setTimeout(() => {
			history.push('/chat');
		}, 1000);
	};

	return (
		<div className="login">
			<div>
				<input
					type="text"
					className="email"
					placeholder="Email or Username"
					ref={userNameRef}
					onChange={userNameInput}
					autoFocus
				/>
				<PasswordField
					getState={setPassword}
					text="Password"
					error={passwordError}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleLogin();
					}}
				/>
				<span className="information">{message}</span>
				<button onClick={handleLogin}>Login</button>
				<span>
					<Link className="link" to="/forgot-password">
						Forgot Password?
					</Link>
				</span>
			</div>
		</div>
	);
}

async function userExists(username) {
	const res = await Fetch.new(
		AUTHENTICATION_URL.USER_EXISTS,
		HTTP_METHOD.GET,
		{
			username,
		}
	).send();

	return res.status === 200;
}

async function getSalt(username) {
	const { salt } = await Fetch.new(
		AUTHENTICATION_URL.GET_SALT,
		HTTP_METHOD.GET,
		{
			username,
		}
	).sendGetJSON();

	return salt;
}

async function login(input, password) {
	const salt = await getSalt(input);

	const hashedPassword = hash(password, salt);

	let userName = '';
	let email = '';
	if (isValidEmail(email)) {
		email = input;
	} else {
		userName = input;
	}

	const [key, , , ,] = useAuthentication();

	const logInOptions = {
		method: 'POST',
		headers: {
			authorization: key,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: userName,
			email: email,
			password: hashedPassword.toString(),
			salt: '',
			uuid: '00000000-0000-0000-0000-000000000000',
		}),
	};

	// const res1 = await Fetch.new(
	// 	AUTHENTICATION_URL.LOGIN,
	// 	HTTP_METHOD.POST
	// ).body({
	// 	username: userName,
	// 		email: email,
	// 		password: hashedPassword.toString(),
	// 		salt: '',
	// 		uuid: '00000000-0000-0000-0000-000000000000',
	// }).send();

	const res = await fetch(AUTHENTICATION_URL.LOGIN, logInOptions);
	const data = await res.json();
	return data;
}
