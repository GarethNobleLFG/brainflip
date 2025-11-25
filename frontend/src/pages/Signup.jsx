import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import Footer from "../components/Footer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = "Name is required.";
        if (!email.trim()) e.email = "Email is required.";
        else if (!emailRegex.test(email)) e.email = "Enter a valid email address.";
        if (!password) e.password = "Password is required.";
        else if (!passwordRegex.test(password)) e.password = "Password must include at least one uppercase, one lowercase letter, and one digit.";
        if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
        else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // TODO: send signup request to server; currently navigate on successful validation
        navigate('/dashboard');
    };

  return (
      <div className="signup-page">
        <header className="top-bar">
        <div className="brand-name">
          <span className="brain-icon">🧠</span>
          BrainFlip
        </div>
        <button className="login-btn" onClick={() => navigate("/")}>home</button>
      </header>
      <div className="signup-container">
      <div className="signup-card">
        <h1 className="brand-name">Create Account</h1>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.name}</div>}

          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.email}</div>}

          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.password}</div>}

          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {errors.confirmPassword && <div style={{ color: '#ff6666', fontSize: '0.9rem', marginTop: '0.1px' }}>{errors.confirmPassword}</div>}

          <button className="submit-btn" type="submit">Sign Up</button>
        </form>
        <p className="signin-text">
          Already have an account? <button className="submit-btn"  type= "button" onClick={() => navigate("/signin")}>Back to Sign In</button>
        </p>
      </div>
      </div>
    </div>
  );
};

export default Signup;
