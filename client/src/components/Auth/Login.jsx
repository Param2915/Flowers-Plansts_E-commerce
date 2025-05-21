
//////////////////////////////// after adding admin part and solving the dashboard issues


import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

// Base URL configuration
axios.defaults.baseURL = 'http://localhost:5000';

// Admin email - should match the one in AdminContext
const ADMIN_EMAIL = "parularora1703@gmail.com";

const Login = () => {
  const { login } = useAuth();
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  /* ---------- local state ---------- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================ LOGIN ================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      // Set user and token in context
      login(response.data.user, response.data.token);
      
      // Store JWT token
      localStorage.setItem('token', response.data.token);

      // Check if the user is admin based on email
      if (email === ADMIN_EMAIL) {
        // Activate admin context
        loginAdmin();
        localStorage.setItem('isAdmin', 'true');
        toast.success("Welcome Admin!");
        navigate("/admin/dashboard");
      } else {
        toast.success(`Welcome, ${response.data.user.name}`);
        navigate("/");
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============ PASSWORD‑RESET FLOW ============ */
  const sendOtp = async () => {
    try {
      await axios.post('/api/auth/forgot-password', { 
        email: resetEmail 
      });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('/api/auth/verify-otp', { 
        email: resetEmail, 
        otp 
      });
      toast.success('OTP verified, set a new password');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  const resetPass = async () => {
    try {
      await axios.post('/api/auth/reset-password', {
        email: resetEmail,
        otp,
        newPassword,
      });
      toast.success('Password reset successful. Please log in.');
      // Clear and close modal
      setShowModal(false);
      setStep(1);
      setOtp('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  /* ================================================= */
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
            disabled={isSubmitting}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          <span className="forgot-link" onClick={() => setShowModal(true)}>
            Forgot Password?
          </span>
        </p>
        <p>
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>

      {/* ---------- MODAL ---------- */}
      {showModal && (
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
                <button onClick={sendOtp}>Send OTP</button>
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
                <button onClick={verifyOtp}>Verify OTP</button>
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
                <button onClick={resetPass}>Reset Password</button>
              </>
            )}

            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;






























//////////////////////// after adding th admin part /////////////////////////////


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import { useAdmin } from '../../context/AdminContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';

// // Base URL configuration
// axios.defaults.baseURL = 'http://localhost:5000';

// // Admin email - should match the one in AdminContext
// const ADMIN_EMAIL = "parularora1703@gmail.com";

// const Login = () => {
//   const { login } = useAuth();
//   const { loginAdmin } = useAdmin();
//   const navigate = useNavigate();

//   /* ---------- local state ---------- */
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [resetEmail, setResetEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   /* ================ LOGIN ================ */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       const response = await axios.post('/api/auth/login', {
//         email,
//         password,
//       });

//       // Set user and token in context
//       login(response.data.user, response.data.token);
      
//       // Store JWT token
//       localStorage.setItem('token', response.data.token);

//       // Check if the user is admin based on email
//       if (email === ADMIN_EMAIL) {
//         // Activate admin context
//         loginAdmin();
//         toast.success("Welcome Admin!");
//         navigate("/admin/dashboard");
//       } else {
//         toast.success(`Welcome, ${response.data.user.name}`);
//         navigate("/");
//       }
//     } catch (err) {
//       console.error('Login failed:', err.response?.data?.message || err.message);
//       toast.error(err.response?.data?.message || 'Invalid credentials');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ============ PASSWORD‑RESET FLOW ============ */
//   const sendOtp = async () => {
//     try {
//       await axios.post('/api/auth/forgot-password', { 
//         email: resetEmail 
//       });
//       toast.success('OTP sent to your email');
//       setStep(2);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error sending OTP');
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       await axios.post('/api/auth/verify-otp', { 
//         email: resetEmail, 
//         otp 
//       });
//       toast.success('OTP verified, set a new password');
//       setStep(3);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Invalid or expired OTP');
//     }
//   };

//   const resetPass = async () => {
//     try {
//       await axios.post('/api/auth/reset-password', {
//         email: resetEmail,
//         otp,
//         newPassword,
//       });
//       toast.success('Password reset successful. Please log in.');
//       // Clear and close modal
//       setShowModal(false);
//       setStep(1);
//       setOtp('');
//       setNewPassword('');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to reset password');
//     }
//   };

//   /* ================================================= */
//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2>Login</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             disabled={isSubmitting}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             disabled={isSubmitting}
//           />
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p>
//           <span className="forgot-link" onClick={() => setShowModal(true)}>
//             Forgot Password?
//           </span>
//         </p>
//         <p>
//           Don&apos;t have an account? <a href="/signup">Sign up</a>
//         </p>
//       </div>

//       {/* ---------- MODAL ---------- */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>Password Reset</h3>

//             {step === 1 && (
//               <>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   value={resetEmail}
//                   onChange={(e) => setResetEmail(e.target.value)}
//                   required
//                 />
//                 <button onClick={sendOtp}>Send OTP</button>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//                 <button onClick={verifyOtp}>Verify OTP</button>
//               </>
//             )}

//             {step === 3 && (
//               <>
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//                 <button onClick={resetPass}>Reset Password</button>
//               </>
//             )}

//             <button className="close-btn" onClick={() => setShowModal(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;
















///////////////////  Without admin part /////////////////////////////




// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import './Auth.css';

// // Base URL configuration
// axios.defaults.baseURL = 'http://localhost:5000';

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   /* ---------- local state ---------- */
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [resetEmail, setResetEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   /* ================ LOGIN ================ */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       const response = await axios.post('/api/auth/login', {
//         email,
//         password,
//       });

//       // Set user and token in context
//       login(response.data.user, response.data.token);
      
//       // Store JWT token
//       localStorage.setItem('token', response.data.token);

//       toast.success(`Welcome, ${response.data.user.name}`);
//       navigate("/");
//     } catch (err) {
//       console.error('Login failed:', err.response?.data?.message || err.message);
//       toast.error(err.response?.data?.message || 'Invalid credentials');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ============ PASSWORD‑RESET FLOW ============ */
//   const sendOtp = async () => {
//     try {
//       await axios.post('/api/auth/forgot-password', { 
//         email: resetEmail 
//       });
//       toast.success('OTP sent to your email');
//       setStep(2);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error sending OTP');
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       await axios.post('/api/auth/verify-otp', { 
//         email: resetEmail, 
//         otp 
//       });
//       toast.success('OTP verified, set a new password');
//       setStep(3);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Invalid or expired OTP');
//     }
//   };

//   const resetPass = async () => {
//     try {
//       await axios.post('/api/auth/reset-password', {
//         email: resetEmail,
//         otp,
//         newPassword,
//       });
//       toast.success('Password reset successful. Please log in.');
//       // Clear and close modal
//       setShowModal(false);
//       setStep(1);
//       setOtp('');
//       setNewPassword('');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to reset password');
//     }
//   };

//   /* ================================================= */
//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2>Login</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             disabled={isSubmitting}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             disabled={isSubmitting}
//           />
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p>
//           <span className="forgot-link" onClick={() => setShowModal(true)}>
//             Forgot Password?
//           </span>
//         </p>
//         <p>
//           Don&apos;t have an account? <a href="/signup">Sign up</a>
//         </p>
//       </div>

//       {/* ---------- MODAL ---------- */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>Password Reset</h3>

//             {step === 1 && (
//               <>
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   value={resetEmail}
//                   onChange={(e) => setResetEmail(e.target.value)}
//                   required
//                 />
//                 <button onClick={sendOtp}>Send OTP</button>
//               </>
//             )}

//             {step === 2 && (
//               <>
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                 />
//                 <button onClick={verifyOtp}>Verify OTP</button>
//               </>
//             )}

//             {step === 3 && (
//               <>
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//                 <button onClick={resetPass}>Reset Password</button>
//               </>
//             )}

//             <button className="close-btn" onClick={() => setShowModal(false)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;