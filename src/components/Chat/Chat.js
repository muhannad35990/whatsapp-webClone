import { Avatar, IconButton } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import "./Chat.css";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase";

function Chat(isRoom) {
  const [input, setinput] = useState("");
  const { roomId } = useParams();
  const { privateChatId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [PrivateMessages, SetPrivateMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue(null);

  useEffect(() => {
    if (roomId && isRoom) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  useEffect(() => {
    if (privateChatId && !isRoom.isRoom) {
      setRoomName(privateChatId);
      db.collection("private-chat")
        .where("users", "array-contains", user.email)
        .onSnapshot(async (snapshot) => {
          const chats = snapshot.docs.map((doc) => doc.data());
          await SetPrivateMessages({
            email: user.email,
            PrivateMessages: chats,
          });
        });
    }
  }, [privateChatId]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (roomId && isRoom.isRoom) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        message: input,
        name: user?.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else if (privateChatId && isRoom.isRoom === false) {
      console.log("sending message", privateChatId, input);
      db.collection("private-chat")
        .doc(privateChatId)
        .collection("messages")
        .update({
          messages: firebase.firestore.FieldValue.arrayUnion({
            sender: user.email,
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          }),
        });
    }
    setinput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>

          <IconButton>
            <AttachFileIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {isRoom.isRoom
          ? messages?.map((message) => (
              <p
                key={message.id}
                className={`chat__message  ${
                  message.name === user.email && "chat__reciever"
                }`}
              >
                <span className="chat__name">{message.name}</span>
                {message.message}
                <span className="chat__timestamp">
                  {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
              </p>
            ))
          : PrivateMessages.PrivateMessages?.map((pp) =>
              pp.messages?.map((m) => (
                <p
                  className={`chat__message  ${
                    m.sender === user.email && "chat__reciever"
                  }`}
                >
                  <span className="chat__name">{m.sender}</span>
                  {m.message}
                  <span className="chat__timestamp">
                    {new Date(m.timestamp?.toDate()).toUTCString()}
                  </span>
                </p>
              ))
            )}
      </div>

      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form>
          <input
            type="text"
            placeholder="type here ..."
            value={input}
            onChange={(e) => setinput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            send
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
