import React, { useEffect, useState, createContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import StatusBar from './StatusBar/StatusBar';
import './Css/Messenger.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import useAuthentication from '../../Util/UseAuth';
import {
	WEBSOCKET_URL,
	ACTION_GET_SELF,
	ACTION_PROFILE_UPDATE,
	ACTION_GET_MESSAGE_LATEST,
	ACTION_PROFILE_GET_OTHER,
} from '../../Util/Websocket';

export const ProfileContext = createContext();
export const ChatContext = createContext({
	selectedChat: '',
	setSelectedChat: () => {},
});

/**
 * The Messenger component is the parent component of the chat application.
 * It contains all the neccessary components to display the chat interface.
 * It renders the sidebar, chat and the status component. Those components are
 * the 3 main components of the chat application and form the chat interface.
 * On the first loaf of the chat, the Messenger component will send the authentication
 * key via websocket to the server. The server will then send back if the key is valid
 * or not. If the key is not valid, it means that the user is not logged in and will
 * get redirected to the login page.
 * If the key is valid, it means that the user is logged in and the chat interface will
 * be displayed and the user will be able to use the chat application.
 */
export default function Messenger() {
	const [logedIn, setLogedIn] = useState(false);
	const [profile, setProfile] = useState();
	const [selectedChat, setSelectedChat] = useState({});

	const history = useHistory();

	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
    onError: () => {
      toast.error("Can not make a connection to the Websocket, the server may be offline");
      history.push("/home")
    }
	});

	useEffect(() => {
		const [key, , isLogedIn] = useAuthentication();

		sendJsonMessage({
			auth: key || '00000000-0000-0000-0000-000000000000',
			user: localStorage.getItem('userName'),
		});
		document.title = 'Monity | Chat';
	}, []);

	useEffect(() => {
		if (lastJsonMessage === null) return;

		if (logedIn) {
			if (lastJsonMessage.action !== ACTION_GET_SELF) return;
			setProfile(lastJsonMessage.content);
			localStorage.setItem('userName', lastJsonMessage.content.userName);
		} else {
			if (lastJsonMessage.error !== 'NONE') {
				toast.error('You are not logged in');
				setTimeout(() => {
					history.push('/login');
				}, 500);
				return;
			}
			setLogedIn(true);
			sendJsonMessage({ action: ACTION_GET_SELF });

			const lastChatId = localStorage.getItem('lastChat') || null;
			const lastUser = localStorage.getItem('lastUser') || null;

			if (lastChatId === null || lastUser === null) return;

			setSelectedChat({ chatId: lastChatId, targetId: lastUser });
			sendJsonMessage({
				action: ACTION_GET_MESSAGE_LATEST,
				chatID: lastChatId,
			});

			sendJsonMessage({
				action: ACTION_PROFILE_GET_OTHER,
				target: lastUser,
			});
		}
	}, [lastJsonMessage]);

	useEffect(() => {
		if (lastJsonMessage === null) return;
		if (lastJsonMessage.action !== ACTION_PROFILE_UPDATE) return;

		setProfile(lastJsonMessage.content);
	}, [lastJsonMessage]);

	return (
		<ProfileContext.Provider value={profile}>
			<ChatContext.Provider value={{ selectedChat, setSelectedChat }}>
				{!logedIn && (
					<div className="loading-screen">
						<img src="/src/image/logo.png" alt="Monity Logo" />
						<div className="frame">
							<div className="dot-spin"></div>
						</div>
						<Link to="/login" className='back'>
							<button>Back to login</button>
						</Link>
					</div>
				)}
				<div className="messenger">
					<Sidebar />
					<div className="placeholder"></div>
					<Chat />
					<StatusBar />
				</div>
			</ChatContext.Provider>
		</ProfileContext.Provider>
	);
}
