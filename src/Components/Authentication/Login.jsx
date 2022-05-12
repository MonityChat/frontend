import React, { useEffect, useRef, useState } from 'react';
import PasswordField from './PasswordField';
import { USER_EXISTS_URL, SALT_URL } from '../../Util/Auth.js';

export default function Login() {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	const userNameRef = useRef();

	const login = async () => {
		if (userName.length < 1 || password.length < 1) {
			setMessage('Please enter a username and a password');
			userNameRef.current.classList.add('error');
			return;
		}

		if (!(await userExists(userName))) {
			setMessage('Invalid userName or Email');
			userNameRef.current.classList.add('error');
			return;
		}

    const salt = await getSalt(userName);
	};

	return (
		<div>
			<h2>Login</h2>
			<div>
				<input
					type="text"
					className="email"
					placeholder="Email or Username"
					ref={userNameRef}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<PasswordField getState={setPassword} text="Password" />
				<span>{message}</span>
				<button onClick={login}>Login</button>
				<span>Forgot Password?</span>
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
