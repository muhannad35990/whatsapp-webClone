import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SideBarChat.css";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";

function SideBarChat({ id, name, addNewChat, isRoom }) {
  const [{ user }, dispatch] = useStateValue();

  const [RoomMessages, setMessages] = useState("");
  const [PrivateMessages, setPrivatechats] = useState("");
  const [lastPmessage, setlastPmessage] = useState(null);
  const [messagesLength, setmessagesLength] = useState(null);
  const [chatName, setchatName] = useState("");
  useEffect(() => {
    if (id) {
      if (isRoom) {
        db.collection("rooms")
          .doc(id)
          .collection("messages")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) =>
            setMessages(snapshot.docs.map((doc) => doc.data()))
          );
      } else {
        db.collection("private-chat")
          .where("users", "array-contains", user.email)
          .onSnapshot(async (snapshot) => {
            const chats = snapshot.docs.map((doc) => doc.data());
            await setPrivatechats({
              email: user.email,
              PrivateMessages: chats,
            });
            id.split(":").map((newchatname) => {
              if (newchatname !== user.email) setchatName(newchatname);
            });

            // PrivateMessages?.PrivateMessages.map((privateChat) => {
            //   //console.log(privateChat.messages);
            //   if (privateChat.users.includes(chatName)) {
            //     setmessagesLength(privateChat.messages.length);
            //     setlastPmessage(
            //       privateChat.messages[privateChat.messages.length - 1]
            //     );
            //   }
            // });
            console.log(messagesLength);
            // setlastPmessage(
            //   messagesLength > 0 &&
            //     PrivateMessages?.PrivateMessages[
            //       PrivateMessages?.PrivateMessages.length - 1
            //     ]?.messages[messagesLength - 1]?.message
            // );
          });
      }
    }
  }, []);

  const createChat = () => {
    const roomName = prompt("please enter name for chat");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };
  return (
    <>
      {/* {!addNewChat && (
        <div onClick={createChat} className="sidebarChat">
          <h2>Add New Chat</h2>
        </div>
      )} */}
      {isRoom ? (
        <Link to={`/rooms/${id}`}>
          <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
              <h2>{name}</h2>
              <p>{RoomMessages[0]?.message}</p>
            </div>
          </div>
        </Link>
      ) : (
        <Link to={`/private/${id}`}>
          <div className="sidebarChat">
            <Avatar />
            <div className="sidebarChat__info">
              <h2>{chatName}</h2>
              <p>{lastPmessage}</p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}

export default SideBarChat;
