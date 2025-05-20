import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Set user and token in context
      login(response.data.user, response.data.token);

      if (response.data.user.isAdmin) {
        // If admin, login via admin context
        loginAdmin();
        toast.success("Welcome Admin!");
        navigate("/admin/dashboard");
      } else {
        toast.success(`Welcome, ${response.data.user.name}`);
        navigate("/");
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/forgotPassword', {
        email: resetEmail,
      });
      toast.success('OTP sent to your email.');
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/verifyOTP', {
        email: resetEmail,
        otp,
      });
      toast.success('OTP verified. Please set your new password.');
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resetPassword', {
        email: resetEmail,
        otp,
        newPassword,
      });
      toast.success('Password reset successful. You can now log in.');
      setShowForgotModal(false);
      setStep(1);
      setOtp('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          <span className="forgot-link" onClick={() => setShowForgotModal(true)}>Forgot Password?</span>
        </p>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>

      {showForgotModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Password Reset</h3>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <button onClick={handleForgotPassword}>Send OTP</button>
              </>
            )}
            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button onClick={handleVerifyOtp}>Verify OTP</button>
              </>
            )}
            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button onClick={handleResetPassword}>Reset Password</button>
              </>
            )}
            <button className="close-btn" onClick={() => setShowForgotModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
