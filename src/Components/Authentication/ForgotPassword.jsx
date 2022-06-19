import React, { useState, useRef } from 'react';
import './Css/ForgotPassword.css';

export default function ForgotPassword() {
	const [message, setMessage] = useState('');
	const [email, setEmail] = useState('');
	const emailRef = useRef();

	const emailInput = (e) => {
		e.target.classList.remove('error');
		setEmail(e.target.value);
	};

	const handlePasswordReset = () => {
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
		
		setMessage('Password reset email sent');
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
