import React, { useState } from "react";
import "./loginSignup.css"; 

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);

  const log = () => alert("Logged In Successful");
  const signup = () => alert("Account Created Successfully");

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
        <div className="toggle-checkbox">
          <input
            id="status"
            type="checkbox"
            checked={isSignup}
            onChange={(e) => setIsSignup(e.target.checked)}
          />
          <label htmlFor="status">
            <div
              className="status-switch"
              data-unchecked="Log In"
              data-checked="Sign Up"
            ></div>
          </label>
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
