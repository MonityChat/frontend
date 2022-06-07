import React, { useState, useEffect, useContext } from "react";
import { ProfileContext } from "../../Messenger";
import "./Css/ProfileView.css";

export default function ProfileView() {
  const profile = useContext(ProfileContext);
  return (
    <div className="profile-view">
      <h2 className="title">Profile</h2>
      <span>{profile?.status}</span>
      <span>{profile?.description}</span>
      <span>{profile?.lastSeen}</span>
      <span>{profile?.uuid}</span>
      <span>{profile?.shortStatus}</span>
    </div>
  );
}
