import { useEffect } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { WEBSOCKET_URL } from './../Util/Websocket';

const CONSOLE_CSS_ERROR =
	'color:red;font-size:1rem;font-weight:bold;background-color: #55000088';
const CONSOLE_CSS_CONFIRM = 'color:lightgreen;font-size:1rem;font-weight:bold';

//TODO implements rest operator to pass multiple functions to the useAction which all get checked

export default function useAction(action = '', cb = () => {}) {
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
		share: true,
		shouldReconnect: false,
		onError,
		onClose,
		onMessage,
		onOpen,
		filter,
	});

	useEffect(() => {
		if (lastJsonMessage === null) return;

		if ('error' in lastJsonMessage && LOGS) {
			console.warn('An error was send with a json message');
		}

		if (
			action === lastJsonMessage.action ||
			action === lastJsonMessage.notification
		) {
			cb(lastJsonMessage);
		}
	}, [lastJsonMessage]);
	return { sendJsonMessage, lastJsonMessage };
}

function filter(rawData) {
	const message = JSON.parse(rawData.data);

	if (
		'action' in message ||
		'notification' in message ||
		'error' in message
	) {
		return true;
	}

	if (LOGS) {
		console.groupCollapsed('Invalid message from server');
		console.log(rawData);
		console.groupEnd('Invalid message from server');
	}
	return false;
}

function onError(e) {
	e.preventDefault();
	console.groupCollapsed('%cWS Error', CONSOLE_CSS_ERROR);
	console.error('Websocket Error');
	console.error(e);
	console.groupEnd('WS Error');
}

function onMessage(e) {
	if (!LOGS) return;

	const data = JSON.parse(e.data);

	console.groupCollapsed(
		'WS message: ' + data.action || data.notification || data.error || '-'
	);
	console.log(e);
	console.groupEnd(
		'WS message: ' + data.action || data.notification || data.error || '-'
	);
}

function onClose(e) {
  if(!LOGS) return;
	console.info('%c👋 Closed Websocket connection 👋', CONSOLE_CSS_ERROR);
}

function onOpen(e) {
  if(!LOGS) return;
	console.info('%c👌 Opened Websocket connection 🤝', CONSOLE_CSS_CONFIRM);
}
