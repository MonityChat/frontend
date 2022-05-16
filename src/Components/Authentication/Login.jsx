import React, { useEffect, useRef, useState } from 'react';
import PasswordField from './PasswordField';
import {
	USER_EXISTS_URL,
	SALT_URL,
	LOGIN_URL,
	SESSION_AUTH,
} from '../../Util/Auth.js';
import { hash } from '../../Util/Encrypt';
import sjcl from 'sjcl';
import './Css/Login.css';

export default function Login() {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);

	const userNameRef = useRef();

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
			setMessage('Invalid userName or Email');
			userNameRef.current.classList.add('error');
			return;
		}

		const data = await login(userName, password);

		console.log(data);
		//if no login
		// if (data.error) {
		// 	setMessage('Invalid password');
		// 	setPasswordError(true);
		// 	return;
		// }
		setMessage('Successfully loged in');
	};

	return (
		<div className='login'>
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
				/>
				<span>{message}</span>
				<button onClick={handleLogin}>Login</button>
				<span className="forgot-password">Forgot Password?</span>
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

async function login(userName, password) {
	const salt = await getSalt(userName);

	//hashing password with the salt from the server
	const hashedPassword = hash(password, salt);

	const logInOptions = {
		method: 'POST',
		headers: {
			authorization: SESSION_AUTH.key,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: userName,
			email: '',
			password: hashedPassword.toString(),
			salt: '',
			uuid: '',
		}),
	};

	const res = await fetch(LOGIN_URL, logInOptions);
	const data = await res.json();
	return data;
}
