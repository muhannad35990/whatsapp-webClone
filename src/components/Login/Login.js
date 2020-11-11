import React from "react";
import "./Login.css";
import logo from "../../assets/whatsapplogo.png";
import { Button } from "@material-ui/core";
import { auth, provider } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import db from "../../firebase";
function Login() {
  const [{}, dispatch] = useStateValue();
  function signIn() {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });

        db.collection("users").doc(result.user.email).set({
          email: result.user.email,
        });
      })
      .catch((error) => alert(error.message));
  }
  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} />
        <div className="login__text">
          <h1>sign in to Whatsapp</h1>
        </div>

        <Button type="submit" onClick={signIn}>
          {" "}
          sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
