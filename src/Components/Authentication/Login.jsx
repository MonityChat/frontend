import React, { useRef, useState } from 'react';
import PasswordField from './PasswordField';
import { toast } from 'react-toastify';
import {
	USER_EXISTS_URL,
	SALT_URL,
	LOGIN_URL,
} from '../../Util/Auth.js';
import { hash } from '../../Util/Encrypt';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useAuthentication from '../../Util/UseAuth';
import './Css/Login.css';

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

		if (result === 'INVALID_PASSWORD') {
			setMessage('Invalid password');
			setPasswordError(true);
			return;
		}
		setMessage('Successfully loged in');
		toast.success('You will be redirected soon.');

		// setLogedIn(true);

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

async function userExists(userName) {
	const res = await fetch(`${USER_EXISTS_URL}?username=${userName}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});

	return res.status !== 404;
}

async function getSalt(userName) {
	const res = await fetch(`${SALT_URL}?username=${userName}`, {
		method: 'GET',
		params: {
			userName,
		},
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const { salt } = await res.json();
	return salt;
}

async function login(input, password) {
	const salt = await getSalt(input);

	//hashing password with the salt from the server
	const hashedPassword = hash(password, salt);

	let userName = '';
	let email = '';
	if (isValidEmail(input)) {
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

	const res = await fetch(LOGIN_URL, logInOptions);
	const data = await res.json();
	return data;
}

function isValidEmail(email) {
	const regExEmail =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
	return email.match(regExEmail) != null;
}
