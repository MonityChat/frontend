import React, { useState, useEffect, useContext, useRef } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { toast } from "react-toastify";
import useAuthentication from "../../../../Util/UseAuth";
import {
  WEBSOCKET_URL,
  ACTION_PROFILE_UPDATE,
  PROFILE_IMAGE_UPLOAD_URL,
  ACTION_GET_SELF,
} from "../../../../Util/Websocket";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineUpload } from "react-icons/hi";
import { ProfileContext } from "../../Messenger";
import ProfilePicture from "./ProfilePicture";
import "./Css/ProfileView.css";

/**
 * Component to render a sidebar view for your profile.
 * it displays your profile and lets you change it.
 * After a change, it will send the data to the server to save it
 */
export default function ProfileView() {
  const [editableShortStatus, setEditableShortStatus] = useState(false);
  const [editableDescription, setEditableDescription] = useState(false);
  const [status, setStatus] = useState();

  const shortStatusRef = useRef();
  const descriptionRef = useRef();
  const profileImageRef = useRef(new Array(2));

  let profile = useContext(ProfileContext);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    share: true,
  });

  useEffect(() => {
    if (!profile) return;

    shortStatusRef.current.value = profile.shortStatus;
    descriptionRef.current.value = profile.description;
    setStatus(profile.status);
  }, [profile]);

  useEffect(() => {
    if (lastJsonMessage === null) return;
    switch (lastJsonMessage.action) {
      case ACTION_PROFILE_UPDATE: {
        toast.success("Successfully changed status");
        break;
      }
    }
  }, [lastJsonMessage]);

  const handleStatusChange = (newStatus) => {
    if (newStatus === profile.status) return;

    sendJsonMessage({
      action: ACTION_PROFILE_UPDATE,
      shortStatus: profile.shortStatus,
      description: profile.description,
      status: newStatus,
    });
  };

  const handleShortStatusChange = (e) => {
    if (!editableShortStatus) return;

    setEditableShortStatus(false);

    if (profile.shortStatus === e.target.value) return;

    const MAX_SHORT_STATUS_LENGTH = 128;
    if (
      e.target.value.length < 1 ||
      e.target.value.length > MAX_SHORT_STATUS_LENGTH
    ) {
      e.target.value = profile.shortStatus;
      return;
    }

    sendJsonMessage({
      action: ACTION_PROFILE_UPDATE,
      shortStatus: e.target.value,
      description: profile.description,
      status: profile.status,
    });
  };

  const handleDescriptionChange = (e) => {
    if (!editableDescription) return;

    setEditableDescription(false);

    if (profile.description === e.target.value) return;

    if (e.target.value.length < 1) {
      e.target.value = profile.description;
      return;
    }

    sendJsonMessage({
      action: ACTION_PROFILE_UPDATE,
      shortStatus: profile.shortStatus,
      description: e.target.value,
      status: profile.status,
    });
  };

  const handleProfileImageSelected = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    let formData = new FormData();
    formData.append("image", file);

    const [key] = useAuthentication();

    const res = await toast.promise(
      fetch(`${PROFILE_IMAGE_UPLOAD_URL}?uuid=${profile.uuid}`, {
        headers: {
          authorization: key,
        },
        method: "POST",
        body: formData,
      }),
      {
        pending: "Uploading new Profile image...",
        success: "Profile image changed 👌",
        error: "Something went wrong",
      }
    );

    if (!res.ok) return;

    const newImageURL = await res.text();

    profileImageRef.current[0].src = `http://localhost:8808/assets${newImageURL}`;
    profileImageRef.current[1].src = `http://localhost:8808/assets${newImageURL}`;
    sendJsonMessage({
      action: ACTION_GET_SELF,
    });
  };

  const copyUUID = () => {
    navigator.clipboard.writeText(profile.uuid);
  };

  return (
    <div className="profile-view view">
      <h2 className="title">Profile</h2>
      <div className="scrollable">
        {!profile ? (
          <div className="placeholder">Loading data...</div>
        ) : (
          <>
            <ProfilePicture
              status={profile.status}
              path={profile.profileImageLocation}
              ref={profileImageRef}
            >
              <div className="change-profile-picture">
                <input
                  type="file"
                  onChange={handleProfileImageSelected}
                  accept="image/png, image/jpeg"
                />
                <HiOutlineUpload
                  style={{
                    stroke: "url(#base-gradient)",
                  }}
                />
              </div>
            </ProfilePicture>

            <span
              className="user-name"
              onClick={copyUUID}
              title={profile.userName}
            >
              {profile.userName}
            </span>
            <span className="uuid">{profile.uuid}</span>
            <div className="status-container">
              <h3>Status</h3>
              <div className="circles">
                <div
                  className={`circle online ${
                    profile.status === STATUS.ONLINE ? "selected" : ""
                  }`}
                  onClick={() => handleStatusChange(STATUS.ONLINE)}
                >
                  <div className="outer"></div>
                  <div className="middle"></div>
                  <div className="inner"></div>
                </div>
                <div
                  className={`circle away ${
                    profile.status === STATUS.AWAY ? "selected" : ""
                  }`}
                  onClick={() => handleStatusChange(STATUS.AWAY)}
                >
                  <div className="outer"></div>
                  <div className="middle"></div>
                  <div className="inner"></div>
                </div>
                <div
                  className={`circle do-not-disturb ${
                    profile.status === STATUS.DO_NOT_DISTURB ? "selected" : ""
                  }`}
                  onClick={() => handleStatusChange(STATUS.DO_NOT_DISTURB)}
                >
                  <div className="outer"></div>
                  <div className="middle"></div>
                  <div className="inner"></div>
                </div>
                <div
                  className={`circle offline ${
                    profile.status === STATUS.OFFLINE ? "selected" : ""
                  }`}
                  onClick={() => handleStatusChange(STATUS.OFFLINE)}
                >
                  <div className="outer"></div>
                  <div className="middle"></div>
                  <div className="inner"></div>
                </div>
              </div>
            </div>
            <div className="short-status-container">
              <h3>Short Status</h3>
              <input
                type="text"
                className="short-status"
                ref={shortStatusRef}
                disabled={!editableShortStatus}
                defaultValue={profile.shortStatus}
                onMouseLeave={handleShortStatusChange}
              />
              <AiOutlineEdit
                className="edit-icon"
                size="2rem"
                onClick={() => setEditableShortStatus(true)}
              />
            </div>
            <div className="description-container">
              <h3>Description</h3>
              <textarea
                disabled={!editableDescription}
                className="description"
                ref={descriptionRef}
                onMouseLeave={handleDescriptionChange}
                defaultValue={profile.description}
              />
              {/* </textarea> */}
              <AiOutlineEdit
                className="edit-icon top"
                size="2rem"
                onClick={() => setEditableDescription(true)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const STATUS = Object.freeze({
  ONLINE: "ONLINE",
  AWAY: "AWAY",
  DO_NOT_DISTURB: "DO_NOT_DISTURB",
  OFFLINE: "OFFLINE",
});
