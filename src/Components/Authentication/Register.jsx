import React, { useState, useRef } from 'react';
import PasswordField from './PasswordField';
import { REGISTER_URL, SESSION_AUTH, getNewKey } from '../../Util/Auth.js';
import './Css/Register.css';
import { generateNewSalt, hash } from '../../Util/Encrypt';

const [key, setKey, isLogedIn, setLogedIn] = useAuthentication();

export default function Register() {
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [message, setMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordConfirmError, setPasswordConfirmError] = useState(false);

	const userNameRef = useRef();
	const emailRef = useRef();

	const userNameInput = (e) => {
		e.target.classList.remove('error');
		setUserName(e.target.value);
	};

	const emailInput = (e) => {
		e.target.classList.remove('error');
		setEmail(e.target.value);
	};

	const handleRegister = async () => {
		setPasswordError(false);
		setPasswordConfirmError(false);
		setMessage('');

		if (
			userName.length < 1 ||
			email.length < 1 ||
			password.length < 1 ||
			passwordConfirm.length < 1
		) {
			setMessage('Please fill out all fields');
			userName.length < 1 && userNameRef.current.classList.add('error');
			email.length < 1 && emailRef.current.classList.add('error');
			password.length < 1 && setPasswordError(true);
			passwordConfirm.length < 1 && setPasswordConfirmError(true);
			return;
		}

		if (!isValidEmail(email)) {
			setMessage('Enter a valid email');
			emailRef.current.classList.add('error');
			return;
		}

		if (!isValidPassword(password)) {
			setMessage('Enter a valid Password');
			setPasswordError(true);
			return;
		}

		if (password !== passwordConfirm) {
			setMessage('Passwords do not match');
			setPasswordConfirmError(true);
			return;
		}

		const result = await register(userName, email, password);

		if (result === 'USERNAME_TAKEN') {
			setMessage('Username already taken');
			userNameRef.current.classList.add('error');
			return;
		}

		if (result === 'EMAIL_NOT_FOUND') {
			setMessage('Email does not exits');
			emailRef.current.classList.add('error');
			return;
		}

		setMessage('Registration Email sent, open the email to end registration');
	};

	return (
		<div className="register">
			<div>
				<input
					type="text"
					placeholder="Username"
					onChange={userNameInput}
					ref={userNameRef}
					autoFocus
				/>
				<input
					type="text"
					placeholder="Email"
					onChange={emailInput}
					ref={emailRef}
				/>
				<PasswordField
					getState={setPassword}
					text="Password"
					error={passwordError}
				/>
				<PasswordField
					getState={setPasswordConfirm}
					text="Cofirm Password"
					error={passwordConfirmError}
				/>
				<span>{message}</span>
				<button onClick={handleRegister}>Sign up</button>
			</div>
		</div>
	);
}

function isValidEmail(email) {
	const regExEmail =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
	return email.match(regExEmail) != null;
}

function isValidPassword(password) {
	const regExPassword =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;
	return password.match(regExPassword) != null;
}

async function register(userName, email, password) {
	const salt = generateNewSalt();
	const hashedPassword = await hash(password, salt);

	await getNewKey();

	const registerOptions = {
		method: 'POST',
		headers: {
			authorization: key,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			username: userName,
			email,
			password: hashedPassword.toString(),
			salt: salt.toString(),
		}),
	};

	const res = await fetch(REGISTER_URL, registerOptions);
	const data = await res.json();
	return data;
}
