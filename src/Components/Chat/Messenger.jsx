import React, { useEffect, useState, createContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Chat from './Chat/Chat';
import StatusBar from './StatusBar/StatusBar';
import './Css/Messenger.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import useAuthentication from '../../Hooks/UseAuth';
import WSSYSTEM from '../../Util/Websocket';
import ERROR from './../../Util/Errors';
import useAction from './../../Hooks/useAction';
import { Toast } from './../../Util/Toast';

const CONSOLE_CSS_ERROR =
	'color:red;font-size:1rem;font-weight:bold;background-color: #55000088';
const CONSOLE_CSS_CONFIRM = 'color:lightgreen;font-size:1rem;font-weight:bold';
const CONSOLE_CSS_INFO = 'color:lightblue;font-size:0.8rem;font-weight:bold';

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

	const [key, , isLogedIn] = useAuthentication();

	const history = useHistory();

	const {sendJsonMessage} = useAction(
		WSSYSTEM.ACTION.PROFILE.UPDATE,
		() => {
			setProfile(lastJsonMessage.content);
		},
		{
			onError: (e) => {
				e.preventDefault();
				Toast.error(
					'Can not make a connection to the Websocket, the server may be offline'
				).send();
				history.push('/');
				console.groupCollapsed('%cWS Error', CONSOLE_CSS_ERROR);
				console.error('Websocket Error');
				console.error(e);
				console.groupEnd('WS Error');
			},
			onClose: (e) => {
				history.push('/login');

				if (!LOGS) return;
				console.info(
					'%c👋 Closed Websocket connection 👋',
					CONSOLE_CSS_ERROR
				);
			},
			onMessage: () => {
				if (!LOGS) return;
				console.info('%c✉️ New Message via WS 👇',
				CONSOLE_CSS_INFO
				);
			},
			onOpen: () => {
				if (!LOGS) return;
				console.info(
					'%c👌 Opened Websocket connection 🤝',
					CONSOLE_CSS_CONFIRM
				);
			},
		}
	);

	useEffect(() => {
		sendJsonMessage({
			auth: key || '00000000-0000-0000-0000-000000000000',
			user: localStorage.getItem('userName') || '-',
		});
		document.title = 'Monity | Chat';
	}, []);


	useAction(WSSYSTEM.ACTION.PROFILE.GET.SELF, (lastJsonMessage) => {
		setProfile(lastJsonMessage.content);
		localStorage.setItem('userName', lastJsonMessage.content.userName);
	});

	useAction(WSSYSTEM.ERROR, (lastJsonMessage, sendJsonMessage) => {
		if (logedIn) return;

		if (lastJsonMessage.error !== ERROR.NONE) {
			Toast.error('You are not logged in').send();
			setTimeout(() => {
				history.push('/login');
			}, 500);
			return;
		}
		setLogedIn(true);
		sendJsonMessage({ action: WSSYSTEM.ACTION.PROFILE.GET.SELF });

		const lastChatId = localStorage.getItem('lastChat') || null;
		const lastUser = localStorage.getItem('lastUser') || null;

		if (!lastChatId || !lastUser) return;

		setSelectedChat({ chatId: lastChatId, targetId: lastUser });

		sendJsonMessage({
			action: WSSYSTEM.ACTION.MESSAGE.GET.LATEST,
			chatID: lastChatId,
		});
		sendJsonMessage({
			action: WSSYSTEM.ACTION.PROFILE.GET.OTHER,
			target: lastUser,
		});
	});

	return (
		<ProfileContext.Provider value={profile}>
			<ChatContext.Provider value={{ selectedChat, setSelectedChat }}>
				{!logedIn && (
					<div className="loading-screen">
						<img
							src={`${prefixDOMAIN}${DOMAIN}/assets/images/monity/logo.png`}
							alt="Monity Logo"
						/>
						<div className="frame">
							<div className="dot-spin"></div>
						</div>
						<Link to="/login" className="back">
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
