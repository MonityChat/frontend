import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import useAuthentication from '../../Hooks/UseAuth.js';
import { generateNewSalt, hash } from '../../Util/Encryption';
import { isValidEmail, isValidPassword } from '../../Util/Helpers';
import AUTHENTICATION_URL from './../../Util/Auth';
import './Css/Register.css';
import PasswordField from './PasswordField';
import ERROR from './../../Util/Errors';
import { Toast } from './../../Util/Toast';
import Fetch from '../../Util/Fetch.js';
import { HTTP_METHOD } from './../../Util/Fetch';

/**
 * Component  to display a register field.
 * Enter all the required data and create an account.
 * For secure passwords is a regEx responsible.
 * After pressing the register button it will make
 * the request to the server and if the
 *  account was created the user will receive an email.
 */
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

		if (userName.length < 3) {
			setMessage('Username must be at least 3 characters long');
			userNameRef.current.classList.add('error');
			return;
		}

		if (!isValidEmail(email)) {
			setMessage('Enter a valid email');
			emailRef.current.classList.add('error');
			return;
		}

		if (!isValidPassword(password)) {
			setMessage(
				'A minimum 8-digit password with a combination of uppercase and lowercase letters and numbers is required.'
			);
			setPasswordError(true);
			return;
		}

		if (password !== passwordConfirm) {
			setMessage('Passwords do not match');
			setPasswordConfirmError(true);
			return;
		}

		const result = await register(userName, email, password);

		if (result === ERROR.USERNAME_IN_USE) {
			setMessage('Username already taken');
			userNameRef.current.classList.add('error');
			return;
		}

		if (result === ERROR.EMAIL_NOT_FOUND) {
			setMessage('Email does not exits');
			emailRef.current.classList.add('error');
			return;
		}

		setMessage(
			'Registration Email sent, open the email to end registration'
		);
		Toast.success('Registration successfull').send();
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
					text="Confirm Password"
					error={passwordConfirmError}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleRegister();
					}}
				/>
				<span className="information">{message}</span>
				<button onClick={handleRegister}>Sign up</button>
			</div>
		</div>
	);
}

async function register(userName, email, password) {
	const salt = generateNewSalt();
	const hashedPassword = await hash(password, salt);
	const [key,,,] = useAuthentication();

	const data = await Fetch.new(AUTHENTICATION_URL.REGISTER, HTTP_METHOD.POST).body({
		username: userName,
		email,
		password: hashedPassword.toString(),
		salt: salt.toString(),
	}).sendAndToast("Registration in progress", undefined, undefined, true);
	return data;
}
