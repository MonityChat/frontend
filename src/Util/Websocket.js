//url for the WS connection
export const WEBSOCKET_URL = `wss${DOMAIN}/monity`;

//url to upload profile image
export const PROFILE_IMAGE_UPLOAD_URL = `${prefixDOMAIN}${DOMAIN}/upload/profileImage`;

//url to upload files
export const FILE_UPLOAD_URL = `${prefixDOMAIN}${DOMAIN}/upload/chatFile`;

//all actions the client send to the server (see more on the excel document)
export const ACTION_CONTACT_SEARCH = 'contact:search';
export const ACTION_CONTACT_ADD = 'contact:add';
export const ACTION_CONTACT_DECLINE = 'contact:decline';
export const ACTION_CONTACT_GET = 'contact:get';
export const ACTION_CONTACT_GET_REQUEST = 'contact:get:request';

export const ACTION_PROFILE_UPDATE = 'profile:update';
export const ACTION_PROFILE_GET_OTHER = 'profile:get:other';

export const ACTION_GROUP_SEARCH = 'profile:search';
export const ACTION_GROUP_GET = 'group:get';
export const ACTION_GROUP_ADD = 'group:add';

export const ACTION_GET_SELF = 'profile:get:self';
export const ACTION_GET_MESSAGE_LATEST = 'chat:private:get:messages:latest';
export const ACTION_GET_MESSAGE = 'chat:private:get:messages';

export const ACTION_MESSAGE_SEND = 'chat:private:send:message';
export const ACTION_MESSAGE_DELETE = 'chat:private:delete:message';
export const ACTION_MESSAGE_EDIT = 'chat:private:edit:message';
export const ACTION_MESSAGE_REACT = 'chat:private:react:message';
export const ACTION_MESSAGE_READ = 'chat:private:read:message';
export const ACTION_SETTINGS_GET_SELF = 'settings:get:self';

export const ACTION_SETTINGS_CHANGE_SELF = 'settings:change:self';

export const ACTION_USER_TYPING = 'user:action:typing';

//notifications the server sends the client (see more on the excel document)
export const NOTIFICATION_FRIEND_REQUEST_INCOME = 'friend:request:income';
export const NOTIFICATION_FRIEND_REQUEST_ACCEPT = 'chat:private:created';

export const NOTIFICATION_MESSAGE_INCOMING = 'chat:private:message:income';
export const NOTIFICATION_MESSAGE_READ = 'chat:private:message:read';
export const NOTIFICATION_MESSAGE_DELETE = 'chat:private:message:deleted';
export const NOTIFICATION_MESSAGE_REACTED = 'chat:private:message:reacted';
export const NOTIFICATION_MESSAGE_RECEIVED = 'chat:private:message:received';
export const NOTIFICATION_MESSAGE_EDITED = 'chat:private:message:edit';

export const NOTIFICATION_USER_ONLINE = 'user:action:online';
export const NOTIFICATION_USER_OFFLINE = 'user:action:offline';

export const NOTIFICATION_USER_UPDATE_PROFILE = 'user:action:update:profile';
export const NOTIFICATION_USER_STARTED_TYPING = 'user:action:started:typing';
export const NOTIFICATION_USER_STOPPED_TYPING = 'user:action:stopped:typing';

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

export const WSSYSTEM = {
	ACTION,
	NOTIFICATION,
};
