import React, { useState } from "react";
import SettingsButton from "./Settings/SettingsButton";
import SettingsView from "./Settings/SettingsView";
import ContactsButton from "./Contacts/ContactsButton";
import ContactView from "./Contacts/ContactView";
import GroupsButton from "./Groups/GroupsButton";
import GroupView from "./Groups/GroupView";
import AddContactsButton from "./AddContact/AddContactsButton";
import AddContactView from "./AddContact/AddContactView";
import BaseGradient from "./BaseGradient";
import SearchButton from "./Search/SearchButton";
import SearchView from "./Search/SearchView";
import BotsButton from "./BotsButton";
import ProfileButton from "./Profile/ProfileButton";
import ProfileView from "./Profile/ProfileView";
import "./Css/Sidebar.css";

export default function Sidebar() {
  const [size, setSize] = useState("3rem");
  const [view, setView] = useState(VIEWS.CONTACTS);

  const handleButtonClick = (e) => {
    const target = e.target.closest(".sidebar-button");
    if (target === null) return;
    setView(target.getAttribute("view"));
  };

  return (
    <div className="sidebar" tabIndex={1}>
      <BaseGradient />
      <div className="buttons" onClick={handleButtonClick}>
        <div className="menu top">
          <ProfileButton
            size={size}
            view={VIEWS.PROFILE}
            selected={VIEWS.PROFILE === view}
          />
          <ContactsButton
            size={size}
            view={VIEWS.CONTACTS}
            selected={VIEWS.CONTACTS === view}
          />
          <GroupsButton
            size={size}
            view={VIEWS.GROUPS}
            selected={VIEWS.GROUPS === view}
          />
          <BotsButton
            size={size}
            view={VIEWS.BOTS}
            selected={VIEWS.BOTS === view}
          />
        </div>
        <div className="menu bottom">
          <AddContactsButton
            size={size}
            view={VIEWS.ADD_CONTACT}
            selected={VIEWS.ADD_CONTACT === view}
          />
          <SearchButton
            size={size}
            view={VIEWS.SEARCH}
            selected={VIEWS.SEARCH === view}
          />
          <SettingsButton
            size={size}
            view={VIEWS.SETTINGS}
            selected={VIEWS.SETTINGS === view}
          />
        </div>
      </div>

      <div className="content">
        {
          {
            [VIEWS.PROFILE]: <ProfileView />,
            [VIEWS.CONTACTS]: <ContactView />,
            [VIEWS.GROUPS]: <GroupView />,
            [VIEWS.BOTS]: <div>Bots</div>,
            [VIEWS.ADD_CONTACT]: <AddContactView />,
            [VIEWS.SEARCH]: <SearchView />,
            [VIEWS.SETTINGS]: <SettingsView />,
          }[view]
        }
      </div>
    </div>
  );
}

const VIEWS = Object.freeze({
  PROFILE: "PROFILE",
  CONTACTS: "CONTACTS",
  GROUPS: "GROUPS",
  BOTS: "BOTS",
  ADD_CONTACT: "ADD_CONTACT",
  SEARCH: "SEARCH",
  SETTINGS: "SETTINGS",
});
