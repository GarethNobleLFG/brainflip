import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signin.css";
import Footer from "../components/Footer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must include at least one uppercase, one lowercase letter, and one digit.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: perform sign-in request here; navigating locally for now
    navigate("/dashboard");
  };

  return (
      <div className="signin-page">
        <header className="top-bar">
        <div className="brand-name">
          <span className="brain-icon">🧠</span>
          BrainFlip
        </div>
        <button className="login-btn" onClick={() => navigate("/")}>home</button>
      </header>
       <div className="signin-container">
        <div className="signin-card">
        <div className="header">
        <h1> Welcome back!!</h1>
        <p>sign in to your account</p>
      </div>
        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          <div classname="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <div classname="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          </div>

          {error && (
            <div style={{ color: "#ff6666", marginTop: "0.2px", fontSize: "0.9rem" }}>{error}</div>
          )}

          <button className="submit-btn" type="submit">Sign In</button>
        </form>
        <p className="signup-text">
          Don’t have an account? <button  className="submit-btn" type="button" onClick={() => navigate("/signup")}>Signup</button>
        </p>
      </div>
      </div>
      </div>

      
  );
};

export default Signin;