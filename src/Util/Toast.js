import { toast } from 'react-toastify';

async function requestNotificationPermission() {
	if (Notification.permission !== 'default') return;

	try {
		const result = await Notification.requestPermission();
		HAS_PERMISSION = result === 'granted';
	} catch (err) {
		console.error('Browser does not support Push notifications ', error);
	}
}

export default async function notify(
	message,
	notifcationType,
	options,
	onFocusLostPushNotification = true
) {
	if(Notification.permission === "default"){
		await requestNotificationPermission();
	}

	if (document.hasFocus()) {
		if (typeof message === 'object') {
			sendToast(
				notifcationType,
				` ${message.title} ${message.message}`,
				options
			);
		} else {
			sendToast(notifcationType, message, options);
		}
	} else {
		if (!onFocusLostPushNotification) return;
		if (typeof message === 'object') {
			sendPushNotification(
				message.title,
				message.message,
				message.onClick,
				options
			);
		} else {
			sendPushNotification(message, undefined, undefined);
		}
	}
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

export class Toast {
	static INFO_TYPE = toast.TYPE.INFO;
	static ERROR_TYPE = toast.TYPE.ERROR;
	static DEFAULT_TYPE = toast.TYPE.DEFAULT;
	static WARNING_TYPE = toast.TYPE.SUCCESS;
	static SUCCESS_TYPE = toast.TYPE.WARNING;

	#type = Toast.DEFAULT_TYPE;
	#message;
	#pauseOnHover = true;
	#pauseOnFocusLoss = false;
	#options = {};

	constructor(type, message) {
		if (Object.values(toast.TYPE).includes(type)) {
			this.#type = type;
		} else {
			this.#type = Toast.DEFAULT_TYPE;
		}

		this.message(message);
	}

	static error(message) {
		return this.new(Toast.ERROR_TYPE, message);
	}

	static success(message) {
		return this.new(Toast.SUCCESS_TYPE, message);
	}

	static info(message) {
		return this.new(Toast.INFO_TYPE, message);
	}

	static default(message) {
		return this.new(Toast.DEFAULT_TYPE, message);
	}

	static warning(message) {
		return this.new(Toast.WARNING_TYPE, message);
	}

	static new(type, message) {
		return new Toast(type, message);
	}

	message(message) {
		if (typeof message === 'string') {
			this.#message = message;
		}

		return this;
	}

	pauseOnFocusLoss(pause) {
		this.#pauseOnFocusLoss = pause === true;
		return this;
	}

	pauseOnHover(pause) {
		this.#pauseOnHover = pause === true;
		return this;
	}

	options(options) {
		if (typeof options === 'object') {
			this.#options = options ?? {};
		}
		return this;
	}

	send() {
		if (this.#message == null || this.#message.length === 0) {
			return this;
		}

		return toast(this.#message, {
			type: this.#type,
			pauseOnHover: this.#pauseOnHover,
			pauseOnFocusLoss: this.#pauseOnFocusLoss,
			...this.#options,
		});
	}
}