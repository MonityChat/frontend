//url for the WS connection
export const WEBSOCKET_URL = "ws://localhost:8808/monity";


//url to upload profile image
export const PROFILE_IMAGE_UPLOAD_URL = "http://localhost:8808/upload/profileImage";


//url to upload files
export const FILE_UPLOAD_URL = "http://localhost:8808/upload/chatFile";


//all actions the client send to the server (see more on the excel document)
export const ACTION_CONTACT_SEARCH = "contact:search";
export const ACTION_CONTACT_ADD = "contact:add";
export const ACTION_CONTACT_DECLINE = "contact:decline";
export const ACTION_CONTACT_GET = "contact:get";
export const ACTION_CONTACT_GET_REQUEST = "contact:get:request";

export const ACTION_PROFILE_UPDATE = "profile:update";
export const ACTION_PROFILE_GET_OTHER = "profile:get:other";

export const ACTION_GROUP_SEARCH = "profile:search";
export const ACTION_GROUP_GET = "group:get";
export const ACTION_GROUP_ADD = "group:add";

export const ACTION_GET_SELF = "profile:get:self";
export const ACTION_GET_MESSAGE_LATEST = "chat:private:get:messages:latest";
export const ACTION_GET_MESSAGE = "chat:private:get:messages";

export const ACTION_MESSAGE_SEND = "chat:private:send:message";
export const ACTION_MESSAGE_DELETE = "chat:private:delete:message";
export const ACTION_MESSAGE_EDIT = "chat:private:edit:message";
export const ACTION_MESSAGE_REACT = "chat:private:react:message";
export const ACTION_MESSAGE_READ = "chat:private:read:message";
export const ACTION_SETTINGS_GET_SELF = "settings:get:self";

export const ACTION_SETTINGS_CHANGE_SELF = "settings:change:self";

export const ACTION_USER_TYPING = "user:action:typing";


//notifications the server sends the client (see more on the excel document)
export const NOTIFICATION_FRIEND_REQUEST_INCOME = "friend:request:income";
export const NOTIFICATION_FRIEND_REQUEST_ACCEPT = "chat:private:created";

export const NOTIFICATION_MESSAGE_INCOMING = "chat:private:message:income";
export const NOTIFICATION_MESSAGE_READ = "chat:private:message:read";
export const NOTIFICATION_MESSAGE_DELETE = "chat:private:message:deleted";
export const NOTIFICATION_MESSAGE_REACTED = "chat:private:message:reacted";
export const NOTIFICATION_MESSAGE_RECEIVED = "chat:private:message:received";
export const NOTIFICATION_MESSAGE_EDITED = "chat:private:message:edit";

export const NOTIFICATION_USER_ONLINE = "user:action:online";
export const NOTIFICATION_USER_OFFLINE = "user:action:offline";

export const NOTIFICATION_USER_UPDATE_PROFILE = "user:action:update:profile";
export const NOTIFICATION_USER_STARTED_TYPING = "user:action:started:typing";
export const NOTIFICATION_USER_STOPPED_TYPING = "user:action:stopped:typing";
