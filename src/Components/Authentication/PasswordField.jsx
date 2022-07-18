import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './Css/PasswordField.css';

/**
 * Component  to display a password field with
 * switchable mode to show or hide the password.
 */
export default function PasswordField({
	getState,
	text,
	error,
	onKeyDown = (e) => {},
}) {
	const passwordRef = useRef();
	const [password, setPassword] = useState('');
	const [visibile, setVisibile] = useState(false);

	useEffect(() => {
		if (visibile) passwordRef.current.type = 'text';
		else passwordRef.current.type = 'password';
	}, [visibile]);

	useEffect(() => {
		getState?.(password);
	}, [password]);

	const toggleVisibility = () => {
		setVisibile((prevVal) => !prevVal);
	};

	const handleInput = (e) => {
		e.target.classList.remove('error');
		setPassword(e.target.value);
	};

	return (
		<div className="password-field-container">
			<input
				className={'password-field' + (error ? ' error' : '')}
				type="text"
				ref={passwordRef}
				onChange={handleInput}
				placeholder={text}
				onKeyDown={onKeyDown}
			/>
			<div className="icon" onClick={toggleVisibility}>
				{visibile ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
			</div>
		</div>
	);
}
