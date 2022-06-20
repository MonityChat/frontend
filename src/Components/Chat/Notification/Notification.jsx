import React, { createContext, useState } from 'react';
import './Css/Notification.css';
import Toast from './Toast';

export const NotificationContext = createContext();

export default function Notification({ children }) {
	const [notification, setNotification] = useState([]);

	const showToast = (
		type = TOAST_TYPE.DEFAULT,
		title,
		message,
		duration = 1000
	) => {
		const id = Math.floor(Math.random() * 1000000);
		setNotification((prev) => [
			...notification,
			{ title, message, type, id },
		]);
		setTimeout(() => {
			setNotification((prev) =>
				notification.filter((notification) => notification.id !== id)
			);
		}, duration);
	};

	return (
		<>
			<NotificationContext.Provider value={showToast}>
				<div>{children}</div>
				<div className="notification">
					{notification.map((toast, i) => (
						<Toast
							type={toast.type}
							title={toast.title}
							message={toast.message}
							key={i}
						/>
					))}
				</div>
			</NotificationContext.Provider>
		</>
	);
}

export const TOAST_TYPE = Object.freeze({
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
	INFO: 'info',
	DEFAULT: 'default',
});
