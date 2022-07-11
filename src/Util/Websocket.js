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
	ERROR: 'error',
};

export default WSSYSTEM;