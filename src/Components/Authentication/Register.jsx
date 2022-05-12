import React from 'react';
import PasswordField from './PasswordField';

export default function Register() {
	return (
		<div>
			<h2>Register</h2>
			<div>
				<input type="text" placeholder="Username" />
				<input type="text" placeholder="Email" />
				<PasswordField getState={console.log} text="Password"/>
				<PasswordField getState={console.log} text="Cofirm Password"/>
				<span>Invalid Password</span>
				<button>Sign up</button>
				<span>Forgot Password?</span>
			</div>
		</div>
	);
}
