import React, { useEffect, useState, createContext } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import StatusBar from './StatusBar/StatusBar';
import './Css/Messenger.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import useAuthentication from '../../Util/UseAuth';
import { WEBSOCKET_URL, ACTION_GET_SELF } from '../../Util/Websocket';

export const ProfileContext = createContext();

export default function Messenger() {
	const [logedIn, setLogedIn] = useState(false);
	const [profile, setProfile] = useState();

	const history = useHistory();

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
	});

	useEffect(() => {
		const [key, , isLogedIn] = useAuthentication();

		sendJsonMessage({
			auth: key,
			user: localStorage.getItem('userName'),
		});

		document.title = 'Monity | Chat';
	}, []);

	useEffect(() => {
		if (lastJsonMessage === null) return;

		if (logedIn) {
			if (lastJsonMessage.action !== ACTION_GET_SELF) return;
			setProfile(lastJsonMessage.content);
		} else {
			if (lastJsonMessage.error !== 'NONE') {
				console.log("doesn't has the permission");
				// history.push("/authentication");
				return;
			}
			setLogedIn(true);
			sendJsonMessage({ action: ACTION_GET_SELF });
		}
	}, [lastJsonMessage]);

	return (
		<ProfileContext.Provider value={profile}>
			<div className="messenger">
				<Sidebar />
				<div className="placeholder"></div>
				<Chat />
				<StatusBar />
			</div>
		</ProfileContext.Provider>
	);
}
