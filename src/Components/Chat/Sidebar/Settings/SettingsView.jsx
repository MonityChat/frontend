import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	COLOR_MODES, COLOR_SCHEME, GRADIENT_SCHEME, MESSAGE_MODES, SettingsContext
} from '../../../../App';
import { ACTION } from '../../../../Util/Websocket';
import useAction from './../../../../Hooks/useAction';
import './Css/SettingsView.css';

/**
 * Component to render a sidebar view for your settings.
 * It lets you choose different themes and set some preferences
 */
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

	const [requestMode, setRequestMode] = useState(REQUEST_MODE.EVERYONE);
	const [dataOption, setDataOption] = useState(DATA_OPTION.EVERYONE);

	const requestModeRef = useRef(new Array(3));
	const dataOptionRef = useRef(new Array(3));

	const { sendJsonMessage } = useAction(
		ACTION.SETTINGS.GET,
		(lastJsonMessage) => {
			setRequestMode(lastJsonMessage.content.friendRequestLevel);
			setDataOption(lastJsonMessage.content.dataOptions);
			switch (lastJsonMessage.content.friendRequestLevel) {
				case REQUEST_MODE.EVERYONE:
					requestModeRef.current[0].checked = true;
					requestModeRef.current[1].checked = false;
					requestModeRef.current[2].checked = false;

					break;
				case REQUEST_MODE.FRIENDS_OF_FRIENDS:
					requestModeRef.current[0].checked = false;
					requestModeRef.current[1].checked = true;
					requestModeRef.current[2].checked = false;
					break;
				case REQUEST_MODE.NONE:
					requestModeRef.current[0].checked = false;
					requestModeRef.current[1].checked = false;
					requestModeRef.current[2].checked = true;
					break;
			}

			switch (lastJsonMessage.content.dataOptions) {
				case DATA_OPTION.EVERYONE:
					dataOptionRef.current[0].checked = true;
					dataOptionRef.current[1].checked = false;
					dataOptionRef.current[2].checked = false;

					break;
				case DATA_OPTION.ONLY_CONTACTS:
					dataOptionRef.current[0].checked = false;
					dataOptionRef.current[1].checked = true;
					dataOptionRef.current[2].checked = false;
					break;
				case DATA_OPTION.NONE:
					dataOptionRef.current[0].checked = false;
					dataOptionRef.current[1].checked = false;
					dataOptionRef.current[2].checked = true;
					break;
			}
		}
	);

	useEffect(() => {
		sendJsonMessage({
			action: ACTION.SETTINGS.GET,
		});
	}, []);

	const handleGradientSchemeChange = (e) => {
		const theme = e.target.value;
		setGradientScheme(theme);
	};

	const handleColorSchemeChange = (e) => {
		const theme = e.target.value;
		setColorScheme(theme);
	};

	const sendUpdateToServer = (setting, value) => {
		sendJsonMessage({
			action: ACTION.SETTINGS.CHANGE,
			setting,
			value,
		});
	};

	const handleFriendRequestChange = (newRequestMode) => {
		setRequestMode(newRequestMode);
		sendUpdateToServer('friendRequestLevel', newRequestMode);
	};

	const handleDataOptionChange = (newDataOption) => {
		setDataOption(newDataOption);
		sendUpdateToServer('dataOption', newDataOption);
	};

	return (
		<div className="settings-view view">
			<h2 className="title">Settings</h2>
			<div className="scrollable">
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
							<select
								onChange={handleGradientSchemeChange}
								disabled={
									colorMode !== COLOR_MODES.GRADIENT_COLOR
								}
							>
								{Object.keys(GRADIENT_SCHEME).map(
									(keyName, i) => (
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
									)
								)}
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
							<select
								onChange={handleColorSchemeChange}
								disabled={
									colorMode !== COLOR_MODES.SINGLE_COLOR
								}
							>
								{Object.keys(COLOR_SCHEME).map((keyName, i) => (
									<option
										key={i}
										value={COLOR_SCHEME[keyName]}
										selected={
											COLOR_SCHEME[keyName] ===
											colorScheme
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
								defaultChecked={
									messageMode === MESSAGE_MODES.ENTER
								}
								value={MESSAGE_MODES.ENTER}
								name="message-mode"
								onClick={() =>
									setMessageMode(MESSAGE_MODES.ENTER)
								}
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

					<li>
						<h3>Allow friend request from</h3>
						<div className="item">
							<input
								type="radio"
								defaultChecked={
									requestMode === REQUEST_MODE.EVERYONE
								}
								value={REQUEST_MODE.EVERYONE}
								name="request-mode"
								onClick={() =>
									handleFriendRequestChange(
										REQUEST_MODE.EVERYONE
									)
								}
								ref={(el) => (requestModeRef.current[0] = el)}
							/>
							<span className="label">everyone</span>
						</div>
						<div className="item">
							<input
								type="radio"
								defaultChecked={
									requestMode ===
									REQUEST_MODE.FRIENDS_OF_FRIENDS
								}
								value={REQUEST_MODE.FRIENDS_OF_FRIENDS}
								name="request-mode"
								onClick={() =>
									handleFriendRequestChange(
										REQUEST_MODE.FRIENDS_OF_FRIENDS
									)
								}
								ref={(el) => (requestModeRef.current[1] = el)}
							/>
							<span className="label">friend of friends</span>
						</div>
						<div className="item">
							<input
								type="radio"
								defaultChecked={
									requestMode === REQUEST_MODE.NONE
								}
								value={REQUEST_MODE.NONE}
								name="request-mode"
								onClick={() =>
									handleFriendRequestChange(REQUEST_MODE.NONE)
								}
								ref={(el) => (requestModeRef.current[2] = el)}
							/>
							<span className="label">none</span>
						</div>
					</li>

					<li>
						<h3>Allow User to see status</h3>
						<div className="item">
							<input
								type="radio"
								defaultChecked={
									dataOption === DATA_OPTION.EVERYONE
								}
								value={DATA_OPTION.EVERYONE}
								name="data-mode"
								onClick={() =>
									handleDataOptionChange(DATA_OPTION.EVERYONE)
								}
								ref={(el) => (dataOptionRef.current[0] = el)}
							/>
							<span className="label">everyone</span>
						</div>
						<div className="item">
							<input
								type="radio"
								defaultChecked={
									dataOption === DATA_OPTION.ONLY_CONTACTS
								}
								value={DATA_OPTION.ONLY_CONTACTS}
								name="data-mode"
								onClick={() =>
									handleDataOptionChange(
										DATA_OPTION.ONLY_CONTACTS
									)
								}
								ref={(el) => (dataOptionRef.current[1] = el)}
							/>
							<span className="label">only contacts</span>
						</div>
						<div className="item">
							<input
								type="radio"
								defaultChecked={dataOption === DATA_OPTION.NONE}
								value={DATA_OPTION.NONE}
								name="data-mode"
								onClick={() =>
									handleDataOptionChange(DATA_OPTION.NONE)
								}
								ref={(el) => (dataOptionRef.current[2] = el)}
							/>
							<span className="label">none</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	);
}

const REQUEST_MODE = Object.freeze({
	EVERYONE: 'ALL',
	FRIENDS_OF_FRIENDS: 'FRIENDS_OF_FRIENDS',
	NONE: 'NONE',
});

const DATA_OPTION = Object.freeze({
	EVERYONE: 'ALL',
	ONLY_CONTACTS: 'ONLY_CONTACTS',
	NONE: 'NONE',
});
