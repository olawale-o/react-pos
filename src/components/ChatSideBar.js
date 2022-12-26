import { BiCog, BiChevronRightSquare, BiSearch } from "react-icons/bi";
import Contacts from "./Contacts";

const ChatSideBarHeader = () => {
  return (
    <div className="chatsidebard-header">
      <div className="header-nav">
        <span className="icon">
          <BiCog />
        </span>
        <span className="icon">
          <BiChevronRightSquare />
        </span>
      </div>
      <div className="img-container" />
      <span className="profile-name">Profile name</span>
      <div className="search">
        <input className="search-input" type="text" placeholder="Search" />
        <span className="icon">
          <BiSearch />
        </span>
      </div>
    </div>
  );
};

const ChatSideBar = () => {
  return (
    <div className="chatsidebar">
      <ChatSideBarHeader />
      <Contacts />
    </div>
  )
};

export default ChatSideBar;
