import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import SideBar from "./components/SideBar/SideBar";
import Chat from "./components/Chat/Chat";
import Login from "./components/Login/Login";
import { useStateValue } from "./StateProvider";
function App() {
  const [{ user }, dispatch] = useStateValue(null);
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <>
          <div className="green__banner"></div>
          <div className="app__body">
            <Router>
              <SideBar />
              <Switch>
                <Route path="/rooms/:roomId">
                  <Chat isRoom={true} />
                </Route>
                <Route path="/private/:privateChatId">
                  <Chat isRoom={false} />
                </Route>
                <Route path="/">
                  <Chat />
                </Route>
              </Switch>
            </Router>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
