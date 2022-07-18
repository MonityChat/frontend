import { useEffect } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import WSSYSTEM from '../Util/Websocket';

// const CONSOLE_CSS_ERROR =
// 	'color:red;font-size:1rem;font-weight:bold;background-color: #55000088';
// const CONSOLE_CSS_CONFIRM = 'color:lightgreen;font-size:1rem;font-weight:bold';

/**
 * Costum Hook to check if a Websocket message actiontype equals with a given
 * actiontype and invokes a callback function if so
 * @param {String} actiontype to check for in the WS message. Can be a notification or action
 * @param {Function} cb to run if the action is equal with the one from the WS
 * @returns {{Function, Function}} object with to functions to send and read WS messages
 */
export default function useAction(actiontype = '', cb = () => {}, wsOptions) {
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(
		WSSYSTEM.URL.WS_CONNECT_URL,
		{
			share: true,
			shouldReconnect: false,
			filter,
			...wsOptions,
		}
	);

	useEffect(() => {
		if (lastJsonMessage === null) return;

		if (
			actiontype === lastJsonMessage.action ||
			actiontype === lastJsonMessage.notification
		) {
			if (cb === null) return;
			onMessage(lastJsonMessage);
			cb(lastJsonMessage, sendJsonMessage);
			return;
		}

		if (lastJsonMessage[actiontype]) {
			if (cb === null) return;
			onMessage(lastJsonMessage);
			cb(lastJsonMessage, sendJsonMessage);
			return;
		}
	}, [lastJsonMessage]);
	return { sendJsonMessage, lastJsonMessage };
}

/**
 * Filter for filtering messages from the WS to check them if they are valid
 * @param {*} rawData
 * @returns {boolean} true or false wheater the message is valid
 */
function filter(rawData) {
	let message = {};
	try {
		message = JSON.parse(rawData.data);
	} catch (error) {
		console.error('WS message body does not cotain valid JSON: ', error);
		return false;
	}

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

/**
 * Prints an error to the console with styling
 * @param {Error} e error
 */
// function onError(e) {
// 	e.preventDefault();
// 	console.groupCollapsed('%cWS Error', CONSOLE_CSS_ERROR);
// 	console.error('Websocket Error');
// 	console.error(e);
// 	console.groupEnd('WS Error');
// }

/**
 * Logs the message to the console if logs are enabled
 * @param {Object} message message from a WS
 */
function onMessage(message) {
	if (!LOGS) return;

	console.groupCollapsed(
		'WS message: ' + (message.action ||
			message.notification ||
			message.error ||
			'-')
	);
	console.log(message);
	console.groupEnd(
		'WS message: ' + (message.action ||
			message.notification ||
			message.error ||
			'-')
	);
}

/**
 * Logs a styled close message
 */
// function onClose(e) {
// 	if (!LOGS) return;
// 	console.info('%c👋 Closed Websocket connection 👋', CONSOLE_CSS_ERROR);
// }

/**
 * Logs a styled open message
 */
// function onOpen(e) {
// 	if (!LOGS) return;
// 	console.info('%c👌 Opened Websocket connection 🤝', CONSOLE_CSS_CONFIRM);
// }
