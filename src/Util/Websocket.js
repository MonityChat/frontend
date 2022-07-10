/** URL for the WS connection*/
/** @deprecated use WSSYTEM instead */
export const WEBSOCKET_URL = `wss${DOMAIN}/monity`;

/**URL to upload profile image*/
/** @deprecated use WSSYTEM instead */
export const PROFILE_IMAGE_UPLOAD_URL = `${prefixDOMAIN}${DOMAIN}/upload/profileImage`;

/**URL to upload files*/
/** @deprecated use WSSYTEM instead */
export const FILE_UPLOAD_URL = `${prefixDOMAIN}${DOMAIN}/upload/chatFile`;

//all actions the client send to the server (see more on the excel document)
/** @deprecated use WSSYTEM instead */
export const ACTION_CONTACT_SEARCH = 'contact:search';
/** @deprecated use WSSYTEM instead */
export const ACTION_CONTACT_ADD = 'contact:add';
/** @deprecated use WSSYTEM instead */
export const ACTION_CONTACT_DECLINE = 'contact:decline';
/** @deprecated use WSSYTEM instead */
export const ACTION_CONTACT_GET = 'contact:get';
/** @deprecated use WSSYTEM instead */
export const ACTION_CONTACT_GET_REQUEST = 'contact:get:request';
/** @deprecated use WSSYTEM instead */
export const ACTION_PROFILE_UPDATE = 'profile:update';
/** @deprecated use WSSYTEM instead */
export const ACTION_PROFILE_GET_OTHER = 'profile:get:other';
/** @deprecated use WSSYTEM instead */
export const ACTION_GROUP_SEARCH = 'profile:search';
/** @deprecated use WSSYTEM instead */
export const ACTION_GROUP_GET = 'group:get';
/** @deprecated use WSSYTEM instead */
export const ACTION_GROUP_ADD = 'group:add';
/** @deprecated use WSSYTEM instead */
export const ACTION_GET_SELF = 'profile:get:self';
/** @deprecated use WSSYTEM instead */
export const ACTION_GET_MESSAGE_LATEST = 'chat:private:get:messages:latest';
/** @deprecated use WSSYTEM instead */
export const ACTION_GET_MESSAGE = 'chat:private:get:messages';
/** @deprecated use WSSYTEM instead */
export const ACTION_MESSAGE_SEND = 'chat:private:send:message';
/** @deprecated use WSSYTEM instead */
export const ACTION_MESSAGE_DELETE = 'chat:private:delete:message';
/** @deprecated use WSSYTEM instead */
export const ACTION_MESSAGE_EDIT = 'chat:private:edit:message';
/** @deprecated use WSSYTEM instead */
export const ACTION_MESSAGE_REACT = 'chat:private:react:message';
/** @deprecated use WSSYTEM instead */
export const ACTION_MESSAGE_READ = 'chat:private:read:message';
/** @deprecated use WSSYTEM instead */
export const ACTION_SETTINGS_GET_SELF = 'settings:get:self';
/** @deprecated use WSSYTEM instead */
export const ACTION_SETTINGS_CHANGE_SELF = 'settings:change:self';
/** @deprecated use WSSYTEM instead */
export const ACTION_USER_TYPING = 'user:action:typing';
/** @deprecated use WSSYTEM instead */
//notifications the server sends the client (see more on the excel document)
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_FRIEND_REQUEST_INCOME = 'friend:request:income';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_FRIEND_REQUEST_ACCEPT = 'chat:private:created';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_MESSAGE_INCOMING = 'chat:private:message:income';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_MESSAGE_READ = 'chat:private:message:read';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_MESSAGE_DELETE = 'chat:private:message:deleted';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_MESSAGE_REACTED = 'chat:private:message:reacted';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_MESSAGE_RECEIVED = 'chat:private:message:received';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_MESSAGE_EDITED = 'chat:private:message:edit';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_USER_ONLINE = 'user:action:online';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_USER_OFFLINE = 'user:action:offline';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_USER_UPDATE_PROFILE = 'user:action:update:profile';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_USER_STARTED_TYPING = 'user:action:started:typing';
/** @deprecated use WSSYTEM instead */
export const NOTIFICATION_USER_STOPPED_TYPING = 'user:action:stopped:typing';

const URL_PREFIX = `${prefixDOMAIN}${DOMAIN}`;

export const ACTION = {
	CONTACT: {
		SEARCH: 'contact:search',
		ADD: 'contact:add',
		DECLINE: 'contact:decline',
		GET: {
			_: 'contact:get',
			REQUEST: 'contact:get:request',
		},
	},
	PROFILE: {
		UPDATE: 'profile:update',
		GET: {
			OTHER: 'profile:get:other',
			SELF: 'profile:get:self',
		},
	},
	GROUP: {
		SEARCH: 'profile:search',
		GET: 'group:get',
		ADD: 'group:add',
	},
	MESSAGE: {
		GET: {
			_: 'chat:private:get:messages',
			LATEST: 'chat:private:get:messages:latest',
		},
		SEND: 'chat:private:send:message',
		DELETE: 'chat:private:delete:message',
		EDIT: 'chat:private:edit:message',
		REACT: 'chat:private:react:message',
		READ: 'chat:private:read:message',
	},
	SETTINGS: {
		GET: 'settings:get:self',
		CHANGE: 'settings:change:self',
	},
	USER: {
		TYPING: 'user:action:typing',
	},
};

export const NOTIFICATION = {
	REQUEST: {
		FRIEND: {
			INCOME: 'friend:request:income',
			ACCEPT: 'chat:private:created',
		},
		GROUP: {},
	},
	MESSAGE: {
		INCOMING: 'chat:private:message:income',
		READ: 'chat:private:message:read',
		DELETE: 'chat:private:message:deleted',
		REACTED: 'chat:private:message:reacted',
		RECEIVED: 'chat:private:message:received',
		EDITED: 'chat:private:message:edit',
	},
	USER: {
		ONLINE: 'user:action:online',
		OFFLINE: 'user:action:offline',
		TYPING: {
			STARTED: 'user:action:started:typing',
			STOPPED: 'user:action:stopped:typing',
		},
		PROFILE_UPDATE: 'user:action:update:profile',
	},
};

export const URL = {
	WS_CONNECT_URL: `wss${DOMAIN}/monity`,
	UPLOAD: {
		PROFILE_IMAGE: `${URL_PREFIX}/upload/profileImage`,
		FILE: `${URL_PREFIX}/upload/chatFile`,
	},
};

const WSSYSTEM = {
	ACTION,
	NOTIFICATION,
	URL,
};

export default WSSYSTEM;