import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import "./loginSignup.css"; 

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const log = () => alert("Logged In Successful");
  const signup = () => alert("Account Created Successfully");

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": { width: 15 },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 8,
      opacity: 1,
      backgroundColor: "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  return (
    <div className="login-container">
      <div className="info-block">
        <h2>Prepify</h2>
        <p>Join our community of food lovers</p>
        <p>and discover thousands of delicious</p>
        <p>recipes</p>
        <h5>⭐ Share your favorite recipies</h5>
        <h5>💬 Connect with other people</h5>
        <h5>❤️ Save recipies you love</h5>
        <h5>📞 Access anywhere, anytime</h5>

        
      </div>

      <div className="form-container">
        <h1>Prepify</h1>
        <div className="toggle-container">
          <p>Log In</p>
          <AntSwitch
            checked={isSignup}
            onChange={(e) => setIsSignup(e.target.checked)}
          />
          <p>Sign Up</p>
        </div>

        {!isSignup ? (
          <div>
            <p>Email</p>
            <input name="email" placeholder="Enter your email" />
            <p>Password</p>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
            />
            <p>
              <button onClick={log}>Login</button>
            </p>
          </div>
        ) : (
          <div>
            <p>Full Name</p>
            <input name="name" placeholder="Enter your full name" />
            <p>Email</p>
            <input name="email" placeholder="Enter your email" />
            <p>Password</p>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
            />
            <p>
              <button onClick={signup}>Sign Up</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
