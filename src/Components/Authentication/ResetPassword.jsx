import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { RESET_PASSWORD_URL } from '../../Util/Auth';
import PasswordField from './PasswordField';
import './CSS/ResetPassword.css';
import { generateNewSalt, hash } from '../../Util/Encrypt';
import useAuthentication from '../../Util/UseAuth.js';

const [key, setKey, isLogedIn, setLogedIn] = useAuthentication();

export default function ResetPassword() {
	const [message, setMessage] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordConfirmError, setPasswordConfirmError] = useState(false);

	const query = useQuery();

	//still needs key for changing password from url

	const passwordInput = (e) => {
		e.target.classList.remove('error');
		setPassword(e.target.value);
	};

	const passwordConfirmInput = (e) => {
		e.target.classList.remove('error');
		setPasswordConfirm(e.target.value);
	};

	const handlePasswordReset = () => {
		if (password.length < 1 || passwordConfirm.length < 1) {
			setMessage('Please fill out all fields');
			setPasswordError(true);
			setPasswordConfirmError(true);
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

		// const result = await resetPassword(password);
		const key = query.get('key');
		
		if(key === null){
			setMessage('No key provided, not able to reset password for current email');
			return;
		}
		// if(result === 'ERROR'){
		// 	setMessage('Error while changing password');
		// 	passwordError(true);
		// 	passwordConfirmError(true);
		// 	return;
		// }

		setMessage('Password successfully changed');
	};

	return (
		<div className="forgot-password inset-container">
			<h1>Password reset</h1>
			<p>Enter your new Password below</p>
			<PasswordField
				getState={setPassword}
				text="New Password"
				error={passwordError}
			/>
			<PasswordField
				getState={setPasswordConfirm}
				text="Confirm new Password"
				error={passwordConfirmError}
			/>
			<span>{message}</span>
			<button onClick={handlePasswordReset}>Change password</button>
		</div>
	);
}

function isValidPassword(password) {
	const regExPassword =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;
	return password.match(regExPassword) != null;
}

async function resetPassword(password) {
	const salt = generateNewSalt();
	const hashedPassword = await hash(password, salt);

	const resetOptions = {
		method: 'POST',
		headers: {
			authorization: key,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			password: hashedPassword.toString(),
			salt: salt.toString(),
		}),
	};

	const res = await fetch(RESET_PASSWORD_URL, resetOptions);
	const data = await res.json();
	return data;
}

function useQuery() {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
}
