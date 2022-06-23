import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { REQEUST_RESET_PASSWORD_URL } from '../../Util/Auth';
import useAuthentication from '../../Util/UseAuth.js';
import './Css/ForgotPassword.css';

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

		if (res === 'EMAIL_NOT_FOUND') {
			setMessage('NO valid email');
			toast.error("The email doesn't exist");
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

function isValidEmail(email) {
	const regExEmail =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
	return email.match(regExEmail) != null;
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
		fetch(REQEUST_RESET_PASSWORD_URL, resetOptions),
		{
			pending: 'Processing',
			success: 'Email sent 👌',
			error: 'Something went wrong',
		}
	);
	const data = await res.json();
	return data;
}
