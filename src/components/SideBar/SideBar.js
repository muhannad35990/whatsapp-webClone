import React, { useState, useEffect } from "react";
import "./SideBar.css";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import SideBarChat from "../SideBarChat/SideBarChat";
import db from "../../firebase";
import { Unsubscribe } from "@material-ui/icons";
import { useStateValue } from "../../StateProvider";
function SideBar() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);
  const [privateChats, setPrivatechats] = useState([]);
  const [privateChatName, setprivateChatName] = useState("");
  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      Unsubscribe();
    };
  }, []);

  useEffect(() => {
    db.collection("private-chat").onSnapshot(async (snapshot) =>
      setPrivatechats(
        await snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    console.log(privateChats);

    return () => {
      Unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <IconButton>
          <Avatar src={user?.photoURL} />
        </IconButton>
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="siderbar__searchContainer">
          <SearchIcon />
          <input type="text" placeholder="Search or start new chat" />
        </div>
      </div>

      <div className="sidebar__chats">
        {/* <SideBarChat addNewChat /> */}
        {rooms.map((room) => (
          <SideBarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            isRoom={true}
          />
        ))}
        {privateChats?.map((privateChat) => (
          <SideBarChat
            key={privateChat.id}
            id={privateChat.id}
            name={privateChat.id}
            isRoom={false}
          />
        ))}
      </div>
    </div>
  );
}

export default SideBar;
