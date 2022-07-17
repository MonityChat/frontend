import { toast } from 'react-toastify';

async function requestNotificationPermission() {
	if (!('Notification' in window)) {
		return;
	}
	if (Notification.permission !== 'default') {
		return;
	}

	try {
		const result = await Notification.requestPermission();
	} catch (err) {
		console.error(err);
	}
}

/**
 * Class to create a Toast which will be displayed in the browser window
 */
export class Toast {
	/** Info toast  */
	static INFO_TYPE = toast.TYPE.INFO;
	/** Error toast  */
	static ERROR_TYPE = toast.TYPE.ERROR;
	/** Default toast  */
	static DEFAULT_TYPE = toast.TYPE.DEFAULT;
	/** Warning toast  */
	static WARNING_TYPE = toast.TYPE.WARNING;
	/** Success toast  */
	static SUCCESS_TYPE = toast.TYPE.SUCCESS;

	#type = Toast.DEFAULT_TYPE;
	#message;
	#pauseOnHover = true;
	#pauseOnFocusLoss = false;
	#options = {};

	/**
	 * Create a new Toast. To send it you need to call @see function send()
	 * @param {*} type
	 * @param {*} message
	 */
	constructor(type, message) {
		if (Object.values(toast.TYPE).includes(type)) {
			this.#type = type;
		} else {
			this.#type = Toast.DEFAULT_TYPE;
		}

		this.message(message);
	}

	/**
	 * Creates a Toast instace of type error
	 * @param {String} message to display. Not necessary, can be set via message()
	 * @returns {Toast} a new Toast instance
	 */
	static error(message) {
		return this.new(Toast.ERROR_TYPE, message);
	}

	/**
	 * Creates a Toast instace of type success
	 * @param {String} message to display. Not necessary, can be set via message()
	 * @returns {Toast} a new Toast instance
	 */
	static success(message) {
		return this.new(Toast.SUCCESS_TYPE, message);
	}

	/**
	 * Creates a Toast instace of type info
	 * @param {String} message to display. Not necessary, can be set via message()
	 * @returns {Toast} a new Toast instance
	 */
	static info(message) {
		return this.new(Toast.INFO_TYPE, message);
	}

	/**
	 * Creates a Toast instace of type default
	 * @param {String} message to display. Not necessary, can be set via message()
	 * @returns {Toast} a new Toast instance
	 */
	static default(message) {
		return this.new(Toast.DEFAULT_TYPE, message);
	}

	/**
	 * Creates a Toast instace of type warning
	 * @param {String} message to display. Not necessary, can be set via message()
	 * @returns {Toast} a new Toast instance
	 */
	static warning(message) {
		return this.new(Toast.WARNING_TYPE, message);
	}

	/**
	 * Create a new Toast instance
	 * @param {String} type of the toast
	 * @param {String} message to display. Not necessary, can be set via message()
	 * @returns {Toast} a new Toast instance
	 */
	static new(type, message) {
		return new Toast(type, message);
	}

	/**
	 * Sets the type of the toast
	 * @param {String} type of the toast
	 * @returns {this} itself for chaining
	 */
	type(type) {
		if (Object.values(toast.TYPE).includes(type)) {
			this.#type = type;
		} else {
			this.#type = Toast.DEFAULT_TYPE;
		}
		return this;
	}

	/**
	 * Set the actuall message of the Toast
	 * @param {String} message to display
	 * @returns {this} itself for chaining
	 */
	message(message) {
		if (typeof message === 'string') {
			this.#message = message;
		}

		return this;
	}

	/**
	 * set if the toast lifetime should pause if window loses focus
	 * @param {boolean} pause on focus lost. If undefined it will be true
	 * @returns {this} itself for chaining
	 */
	pauseOnFocusLoss(pause) {
		if (pause === undefined) {
			this.#pauseOnFocusLoss = true;
		} else {
			this.#pauseOnFocusLoss = pause === true;
		}
		return this;
	}

	/**
	 * set if the toast lifetime should pause if you hover over it
	 * @param {boolean} pause if you hover on the toast. If undefined it will be true
	 * @returns {this} itself for chaining
	 */
	pauseOnHover(pause) {
		if (pause === undefined) {
			this.#pauseOnHover = true;
		} else {
			this.#pauseOnHover = pause === true;
		}

		return this;
	}

	/**
	 * additional options for the toast
	 * @param {Object} options
	 * @returns {this} itself for chaining
	 */
	options(options) {
		if (typeof options === 'object') {
			this.#options = options ?? {};
		}
		return this;
	}

	/**
	 * Send the current Toast to let it be displayed
	 * @returns {toast | this} toast object or the class instance itself
	 * if no message was provided
	 */
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

	/**
	 * Send the toast if the window has focus, otherwise create a new PushNotification and return it so you
	 * can chain a PushNotification after it
	 * @requires ! to use optional chaining, because it can return undefined
	 * @example Toast.error("Example").sendOrElse()?.title("Example").send()
	 * @returns { PushNotification | undefined} depending if the document had focus or not. If no focus it will return a
	 * new instance of PushNotification with the title being "Notification" and the message being the message from the toast
	 */
	sendOrElse() {
		let pushNotification;
		if (document.hasFocus()) {
			this.send();
		} else {
			pushNotification = new PushNotification(
				'Notification',
				this.#message
			);
		}

		return pushNotification;
	}

	/**
	 * Send the Toast if the window has focus, otherwise take the passed PushNotification and send it
	 * @param {PushNotification} pushNotification to send if window has no focus.
	 * If not instance of PushNotification do nothing
	 * @returns {toast | Notification} depending on what was called
	 */
	sendIfFocus(pushNotification) {
		if (document.hasFocus()) {
			return this.send();
		} else {
			if (pushNotification instanceof PushNotification) {
				return pushNotification.send();
			}
		}
	}
}

/**
 * Class to create a Notification which will be displayed on the desktop
 */
export class PushNotification {
	/** are notifications granted */
	static #notificationPermission = Notification?.permission;

	/** are notifications supported*/
	static #notificationIsSupported = Boolean(
		window.Notification ||
			window.webkitNotifications ||
			navigator.mozNotification
	);

	#title;
	#message;
	#onClick = null;
	#icon;
	#image;
	#options;

	/**
	 * Create a new Notification. To send it you need to call @see send()
	 * @param {String} title of the notification
	 * @param {String} [message] to be displayed
	 * @param {Function} [onClick] invoked when the notification is clicked.
	 * @param {number}
	 */
	constructor(title, message, onClick) {
		if (PushNotification.#notificationPermission === 'default') {
			requestNotificationPermission();
		}

		if (typeof title === 'string') {
			this.#title = title;
		}
		if (typeof message === 'string') {
			this.#message = message;
		}
		if (typeof onClick === 'function') {
			this.#onClick = onClick;
		}
	}

	/**
	 * Creates a new Notification instance
	 * @param {String} title of the notification
	 * @param {String} [message] to be displayed
	 * @param {Function} [onClick] invoked when the notification is clicked
	 * @returns {PushNotification} a new PushNotification instance
	 */
	static new(title, message, onClick) {
		return new PushNotification(title, message, onClick);
	}

	/**
	 * Add a message to the Notification
	 * @param {String} message to add
	 * @returns  {this} itself for chaining
	 */
	message(message) {
		if (typeof message === 'string') {
			this.#message = message;
		}
		return this;
	}

	/**
	 * Add a title to the Notification
	 * @param {String} title to add
	 * @returns  {this} itself for chaining
	 */
	title(title) {
		if (typeof title === 'string') {
			this.#title = title;
		}
		return this;
	}

	/**
	 * Add a onClick Listener to the Notification
	 * @param {Function} cb to call on click
	 * @returns  {this} itself for chaining
	 */
	onClick(cb) {
		if (typeof cb === 'function') {
			this.#onClick = cb;
		}

		return this;
	}

	/**
	 * Add a icon to the Notification
	 * @param {String} path to the icon
	 * @returns  {this} itself for chaining
	 */
	icon(path) {
		if (typeof path === 'string') {
			this.#icon = path;
		}

		return this;
	}

	/**
	 * Add a image to the Notification
	 * @param {String} path to the image
	 * @returns  {this} itself for chaining
	 */
	image(path) {
		if (typeof path === 'string') {
			this.#image = path;
		}

		return this;
	}

	/**
	 * Add additional options to the Notification
	 * @param {Object} options for the Notification @see Notification API from JS
	 * @returns  {this} itself for chaining
	 */
	options(options) {
		if (typeof options === 'object') {
			this.#options = options;
		}

		return this;
	}

	/**
	 * Send the current Notification to let it be displayed
	 * @returns {PushNotification | this} PushNotfication instance or the class instance itself
	 * if no title was provided or if notifications are not supported
	 */
	send() {
		if (!this.#title) {
			return this;
		}
		if (!PushNotification.#notificationIsSupported) {
			return this;
		}

		try {
			const notification = new Notification(this.#title, {
				body: this.#message,
				icon: this.#icon,
				image: this.#image,
				...this.#options,
				renotify: true,
				tag: 'no-empty',
			});

			if (this.#onClick !== null) {
				notification.onclick = this.#onClick;
			}
			return notification;
		} catch (err) {
			console.error(err);
			return this;
		}
	}
}