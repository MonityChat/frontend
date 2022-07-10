import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordField from "./PasswordField";
import "./Css/ResetPassword.css";
import { generateNewSalt, hash } from "../../Util/Encryption";
import useAuthentication from "../../Hooks/UseAuth.js";
import AUTHENTICATION_URL from './../../Util/Auth';
import useQuery from './../../Hooks/useQuery';
import { isValidPassword } from './../../Util/Helpers';

const [key, setKey, isLogedIn, setLogedIn] = useAuthentication();

export default function ResetPassword() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);

  const query = useQuery();
  const history = useHistory();

  const passwordInput = (e) => {
    e.target.classList.remove("error");
    setPassword(e.target.value);
  };

  const passwordConfirmInput = (e) => {
    e.target.classList.remove("error");
    setPasswordConfirm(e.target.value);
  };

  const handlePasswordReset = async () => {
    if (password.length < 1 || passwordConfirm.length < 1) {
      setMessage("Please fill out all fields");
      setPasswordError(true);
      setPasswordConfirmError(true);
      return;
    }

    if (!isValidPassword(password)) {
      setMessage("Enter a valid Password");
      setPasswordError(true);
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("Passwords do not match");
      setPasswordConfirmError(true);
      return;
    }

    const id = query.get("id");

    if (id === null) {
      setMessage(
        "No key provided, not able to reset password for current email"
      );
      return;
    }

    const res = await resetPassword(password, id);

    if (res !== "NONE") {
      setMessage("Error while changing password");
      passwordError(true);
      passwordConfirmError(true);
      toast.error("Error while changing password");
      return;
    }

    setMessage("Password successfully changed");
    setTimeout(() => {
      history.push("/login");
    }, 1500);
  };

  return (
    <div className="forgot-password inset-container">
      <h1>Password reset</h1>
      <p>Enter your new Password below</p>
      <PasswordField
        getState={setPassword}
        text="New Password"
        error={passwordError}
      />
      <PasswordField
        getState={setPasswordConfirm}
        text="Confirm new Password"
        error={passwordConfirmError}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleLogin();
        }}
      />
      <span>{message}</span>
      <button onClick={handlePasswordReset}>Change password</button>
    </div>
  );
}

async function resetPassword(password, id) {
  const salt = generateNewSalt();
  const hashedPassword = await hash(password, salt);

  const resetOptions = {
    method: "POST",
    headers: {
      authorization: key,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: hashedPassword.toString(),
      salt: salt.toString(),
      username: "",
      email: "",
      uuid: "00000000-0000-0000-0000-000000000000",
    }),
  };

  const res = await fetch(`${AUTHENTICATION_URL.PASSWORD.RESET_CONFIRM}?id=${id}`, resetOptions);
  const data = await res.json();
  return data;
}
