import { toast } from 'react-toastify';
import SearchButton from './../Components/Chat/Sidebar/Search/SearchButton';

let HAS_PERMISSION = Notification.permission === 'granted';

export async function requestNotificationPermission() {
	if (Notification.permission !== 'default') return;

	try {
		const result = await Notification.requestPermission();
		HAS_PERMISSION = result === 'granted';
	} catch (err) {
		console.error('Browser does not support Push notifications ', error);
	}
}

export default function notify(
	message,
	notifcationType,
    options,
	onFocusLostPushNotification = true
) {
	requestNotificationPermission();
	if (document.hasFocus()) {
		if (typeof message === 'object') {
			sendToast(notifcationType, ` ${message.title} ${message.message}`, options);
		} else {
			sendToast(notifcationType, message, options);
		}
	} else {
		if (!onFocusLostPushNotification) return;
		if (typeof message === 'object') {
			sendPushNotification(message.title, message.message, message.onClick, options);
		} else {
			sendPushNotification(message, undefined, undefined);
		}
	}
}

function sendToast(type = NOTIFICATION_TYPES.DEFAULT, message, options) {
	if (message == null) return;
	if (!Object.values(NOTIFICATION_TYPES).includes(type)) return;

	toast(message, { type: type, ...options });
}

function sendPushNotification(title, body, onClick, options) {
	const notification = new Notification(title, {
		body: body ?? '',
		...options,
	});

	if (onClick != null) {
		notification.onclick = onClick;
	}
}

export const NOTIFICATION_TYPES = Object.freeze({
	INFO: toast.TYPE.INFO,
	ERROR: toast.TYPE.ERROR,
	DEFAULT: toast.TYPE.DEFAULT,
	SUCCESS: toast.TYPE.SUCCESS,
	WARNING: toast.TYPE.WARNING,
});
