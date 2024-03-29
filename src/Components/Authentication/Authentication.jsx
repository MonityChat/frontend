import { useEffect, useRef, useState } from 'react';
import './Css/Authentication.css';
import Login from './Login';
import Register from './Register';

//Authentication modes
const MODES = Object.freeze({
	LOGIN: 'LOGIN',
	REGISTER: 'REGISTER',
});

/**
 * Component which display the login page.
 *  It renders a login or register component,
 *  depending on the currently selected mode.
 */
export default function Authentication() {
	const [mode, setMode] = useState(MODES.LOGIN);
	const logInRef = useRef();
	const registerRef = useRef();

	useEffect(() => {
		document.title = 'Monity ' + mode;
		logInRef.current.classList.toggle('selected', mode === MODES.LOGIN);
		registerRef.current.classList.toggle(
			'selected',
			mode === MODES.REGISTER
		);
	}, [mode, []]);

	return (
		<div className="authentication inset-container">
			<h1>Monity</h1>
			<div>
				<button
					className="button-switch"
					onClick={() => setMode(MODES.LOGIN)}
					ref={logInRef}
				>
					{MODES.LOGIN}
				</button>
				<button
					className="button-switch"
					onClick={() => setMode(MODES.REGISTER)}
					ref={registerRef}
				>
					{MODES.REGISTER}
				</button>
			</div>
			{mode === MODES.LOGIN ? <Login /> : <Register />}
		</div>
	);
}
