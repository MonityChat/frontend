import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BiBlock } from "react-icons/bi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import ProfilePicture from "../Sidebar/Profile/ProfilePicture";
import "./Css/ContactStatus.css";

export default function ContactStatus({
  userName,
  uuid,
  status,
  lastOnline,
  profileImage,
  shortStatus,
  description,
}) {
  const descriptionRef = useRef();
  const profileRef = useRef(new Array(2));

  const copyUUID = () => {
    navigator.clipboard.writeText(uuid);
  };

  return (
    <div className="contact-status">
      <ProfilePicture path={profileImage} status={status} ref={profileRef} />
      <div className="user-name" title={userName} onClick={copyUUID}>
        {userName}
      </div>
      <span className="uuid">{uuid}</span>
      <div className="short-status">{shortStatus}</div>
      <div className="description" ref={descriptionRef}>
        <ReactMarkdown children={description} remarkPlugins={[remarkGfm]} />
      </div>
      <div className="settings">
        <BiBlock size={"3rem"} />
        <AiOutlineUsergroupAdd size={"3rem"} />
      </div>
    </div>
  );
}
