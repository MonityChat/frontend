import React, { useState, useEffect, useRef } from 'react';
import './Css/PasswordField.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function PasswordField({ getState, text }) {
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
		<>
			<input
				className="password-field error"
				type="text"
				ref={passwordRef}
				onChange={handleInput}
				placeholder={text}
			/>
			<div className="icon" onClick={toggleVisibility}>
				{visibile ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
			</div>
		</>
	);
}
