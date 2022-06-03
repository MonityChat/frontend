import React, { useState, useRef } from 'react';
import PasswordField from './PasswordField';
import './CSS/ResetPassword.css';

export default function ResetPassword() {
	// const [message, setMessage] = useState('');
	// const [password, setPassword] = useState('');
	// const [passwordConfirm, setPasswordConfirm] = useState('');
    // const [passwordError, setPasswordError] = useState(false);
	// const [passwordConfirmError, setPasswordConfirmError] = useState(false);

	// const passwordRef = useRef();
	// const passwordCofirmRef = useRef();

	// const passwordInput = (e) => {
	// 	e.target.classList.remove('error');
	// 	setEmail(e.target.value);
	// };

	// const handlePasswordReset = () => {
	// 	if (email.length < 1) {
	// 		setMessage('Please enter a new Password');
	// 		emailRef.current.classList.add('error');
	// 		return;
	// 	}

	// 	if (!isValidPassword(password)) {
	// 		setMessage('Enter a valid Password');
	// 		setPasswordError(true);
	// 		return;
	// 	}

    //     if()

	// 	setMessage('Password reset email sent');
	// };

	return (
		<div className="forgot-password inset-container">
			<h1>Password reset</h1>
			<p>Enter your new Password below</p>
			<PasswordField />
			<PasswordField />
			{/* <span>{message}</span>
			<button onClick={handlePasswordReset}>Change password</button> */}
		</div>
	);
}

function isValidPassword(password) {
	const regExPassword =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;
	return password.match(regExPassword) != null;
}
