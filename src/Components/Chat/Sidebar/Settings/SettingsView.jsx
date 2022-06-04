import React, { useContext, useEffect, useState } from 'react';
import {
	COLOR_MODES,
	MESSAGE_MODES,
	GRADIENT_SCHEME,
	COLOR_SCHEME,
	SettingsContext,
} from '../../../../App';
import './Css/SettingsView.css';

export default function SettingsView() {
	const {
		colorMode,
		setColorMode,
		messageMode,
		setMessageMode,
		gradientScheme,
		setGradientScheme,
		colorScheme,
		setColorScheme,
	} = useContext(SettingsContext);

	const handleGradientSchemeChange = (e) => {
		const theme = e.target.value;
		setGradientScheme(theme);
	};

	const handleColorSchemeChange = (e) => {
		const theme = e.target.value;
		setColorScheme(theme);
	};

	return (
		<div className="settings-view">
			<h2 className="title">Settings</h2>
			<ul className="list">
				<li>
					<h3>Color scheme</h3>
					<div className="item">
						<input
							type="radio"
							defaultChecked={
								colorMode === COLOR_MODES.GRADIENT_COLOR
							}
							name="color-scheme"
							onClick={() =>
								setColorMode(COLOR_MODES.GRADIENT_COLOR)
							}
						/>
						<span className="label">Gradient</span>
						<select onChange={handleGradientSchemeChange}>
							{Object.keys(GRADIENT_SCHEME).map((keyName, i) => (
								<option
									key={i}
									value={GRADIENT_SCHEME[keyName]}
									selected={
										GRADIENT_SCHEME[keyName] ===
										gradientScheme
									}
								>
									{GRADIENT_SCHEME[keyName]}
								</option>
							))}
						</select>
					</div>
					<div className="item">
						<input
							type="radio"
							defaultChecked={
								colorMode === COLOR_MODES.SINGLE_COLOR
							}
							name="color-scheme"
							onClick={() =>
								setColorMode(COLOR_MODES.SINGLE_COLOR)
							}
						/>
						<span className="label">Single color</span>
						<select onChange={handleColorSchemeChange}>
							{Object.keys(COLOR_SCHEME).map((keyName, i) => (
								<option
									key={i}
									value={COLOR_SCHEME[keyName]}
									selected={
										COLOR_SCHEME[keyName] === colorScheme
									}
								>
									{COLOR_SCHEME[keyName]}
								</option>
							))}
						</select>
					</div>
				</li>
				<li>
					<h3>Send message via</h3>
					<div className="item">
						<input
							type="radio"
							defaultChecked={messageMode === MESSAGE_MODES.ENTER}
							value={MESSAGE_MODES.ENTER}
							name="message-mode"
							onClick={() => setMessageMode(MESSAGE_MODES.ENTER)}
						/>
						<span className="label">Enter</span>
					</div>
					<div className="item">
						<input
							type="radio"
							defaultChecked={
								messageMode === MESSAGE_MODES.ENTER_CTRL
							}
							value={MESSAGE_MODES.ENTER_CTRL}
							name="message-mode"
							onClick={() =>
								setMessageMode(MESSAGE_MODES.ENTER_CTRL)
							}
						/>
						<span className="label">Enter + Control</span>
					</div>
					<div className="item">
						<input
							type="radio"
							defaultChecked={
								messageMode === MESSAGE_MODES.ENTER_SHIFT
							}
							value={MESSAGE_MODES.ENTER_SHIFT}
							name="message-mode"
							onClick={() =>
								setMessageMode(MESSAGE_MODES.ENTER_SHIFT)
							}
						/>
						<span className="label">Enter + Shift</span>
					</div>
				</li>
			</ul>
		</div>
	);
}
