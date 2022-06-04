import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Authentication from './Components/Authentication/Authentication';
import FileNotFound from './Components/NotFound/FileNotFound';
import Home from './Components/Home/Home';
import ForgotPassword from './Components/Authentication/ForgotPassword';
import ResetPassword from './Components/Authentication/ResetPassword';
import Messenger from './Components/Chat/Messenger';
import './Css/Forms.css';
import './Css/Index.css';

export const SettingsContext = createContext();

export default function App() {
	const [colorMode, setColorMode] = useState(
		localStorage.getItem('colorMode') || COLOR_MODES.GRADIENT_COLOR
	);
	const [gradientScheme, setGradientScheme] = useState(
		localStorage.getItem('gradientScheme') || GRADIENT_SCHEME.SUNSET
	);
	const [colorScheme, setColorScheme] = useState(
		localStorage.getItem('colorScheme') || COLOR_SCHEME.WHITE
	);
	const [messageMode, setMessageMode] = useState(
		localStorage.getItem('messageMode') || MESSAGE_MODES.ENTER
	);

	useEffect(() => {
		if (colorMode === COLOR_MODES.GRADIENT_COLOR) {
			document.documentElement.style.setProperty(
				'--c-gradient-1',
				`var(--scheme-${gradientScheme}-1, #FF7A00)`
			);
			document.documentElement.style.setProperty(
				'--c-gradient-2',
				`var(--scheme-${gradientScheme}-2, #FF00C7)`
			);
			localStorage.setItem('gradientScheme', gradientScheme);
		} else if (colorMode === COLOR_MODES.SINGLE_COLOR) {
			document.documentElement.style.setProperty(
				'--c-gradient-1',
				`var(--scheme-${colorScheme}-1, red)`
			);
			document.documentElement.style.setProperty(
				'--c-gradient-2',
				`var(--scheme-${colorScheme}-1, red)`
			);
			localStorage.setItem('colorScheme', colorScheme);
		}

		localStorage.setItem('colorMode', colorMode);
	}, [colorMode, gradientScheme, colorScheme]);

	useEffect(() => {
		localStorage.setItem('messageMode', messageMode);
	}, [messageMode]);

	return (
		<SettingsContext.Provider
			value={{
				colorMode,
				setColorMode,
				messageMode,
				setMessageMode,
				gradientScheme,
				setGradientScheme,
				colorScheme,
				setColorScheme,
			}}
		>
			<BrowserRouter forceRefresh={true}>
				<div>
					<Switch>
						<Route
							path="/forgot-password"
							component={ForgotPassword}
							exact
						/>
						<Route
							path="/reset-password"
							component={ResetPassword}
							exact
						/>
						<Route path="/home" component={Home} exact />
						<Route
							path="/authentication"
							component={Authentication}
							exact
						/>
						<Route path="/" component={Messenger} exact />
						<Route component={FileNotFound} exact />
					</Switch>
				</div>
			</BrowserRouter>
		</SettingsContext.Provider>
	);
}

export const COLOR_MODES = Object.freeze({
	GRADIENT_COLOR: 'GRADIENT_COLOR',
	SINGLE_COLOR: 'SINGLE_COLOR',
});

export const MESSAGE_MODES = Object.freeze({
	ENTER: 'ENTER',
	ENTER_CTRL: 'ENTER_CTRL',
	ENTER_SHIFT: 'ENTER_SHIFT',
});

export const GRADIENT_SCHEME = Object.freeze({
	UNDERWATER: 'underwater',
	SUNSET: 'sunset',
	SUNSHINE: 'sunshine',
	ICY: 'icy',
	NEON: 'neon',
});

export const COLOR_SCHEME = Object.freeze({
	GREEN: 'green',
	RED: 'red',
	BLUE: 'blue',
	GREY: 'grey',
});
