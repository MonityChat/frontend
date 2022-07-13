import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import useAuthentication from '../../Hooks/UseAuth.js';
import './Css/ForgotPassword.css';
import AUTHENTICATION_URL from './../../Util/Auth';
import ERROR from './../../Util/Errors';
import { isValidEmail } from '../../Util/Helpers.js';
import { Toast } from './../../Util/Toast';

const [key, setKey, isLogedIn, setLogedIn] = useAuthentication();

/**
 *Component which display the forgot password page.
  It lets you enter an email and after pressing the button
   it will send a password reset request.
 */
export default function ForgotPassword() {
	const [message, setMessage] = useState('');
	const [email, setEmail] = useState('');
	const emailRef = useRef();

	const emailInput = (e) => {
		e.target.classList.remove('error');
		setEmail(e.target.value);
	};

	const handlePasswordReset = async () => {
		if (email.length < 1) {
			setMessage('Please enter your email');
			emailRef.current.classList.add('error');
			return;
		}

		if (!isValidEmail(email)) {
			setMessage(
				'The email you entered is not in the correct format. Please check.'
			);
			emailRef.current.classList.add('error');
			return;
		}

		const res = await sendResetRequest(email);

		if (res === ERROR.EMAIL_NOT_FOUND) {
			setMessage('No valid email');
			Toast.error("The email doesn't exist").send();
			return;
		}

		setMessage('Password reset email sent, please check your mails');
	};

	return (
		<div className="forgot-password inset-container">
			<h1>Forgot password?</h1>
			<p>
				Enter your email below and you will shortly receive an email
				with instructions on how to reset your password.
			</p>
			<input
				type="text"
				placeholder="Email"
				onChange={emailInput}
				ref={emailRef}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleLogin();
				}}
			/>
			<span>{message}</span>
			<button onClick={handlePasswordReset}>Send email</button>
		</div>
	);
}

async function sendResetRequest(email) {
	const resetOptions = {
		method: 'POST',
		headers: {
			authorization: key,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			password: '',
			salt: '',
			username: '',
			uuid: '00000000-0000-0000-0000-000000000000',
			email: email,
		}),
	};

	const res = await toast.promise(
		fetch(AUTHENTICATION_URL.PASSWORD.RESET_REQUEST, resetOptions),
		{
			pending: 'Processing',
			// success: 'Request Finished',
			error: 'Something went wrong',
		}
	);
	const data = await res.json();
	return data;
}
