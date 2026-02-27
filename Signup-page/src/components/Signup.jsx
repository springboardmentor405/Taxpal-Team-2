import { useState } from "react";
import "../styles/Signup.css";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="logo">🛡️ TaxPal</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" placeholder="Username" required />
          </div>

          <div className="input-group">
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Choose your password"
              required
            />
            <span className="toggle" onClick={togglePassword}>
              👁
            </span>
          </div>

          <div className="input-group">
            <input type="password" placeholder="Confirm Password" required />
          </div>

          <div className="input-group">
            <select required>
              <option value="">Select your country</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
            </select>
          </div>

          <div className="input-group">
            <select>
              <option value="">Income Bracket (Optional)</option>
              <option>Below ₹5L</option>
              <option>₹5L - ₹10L</option>
              <option>Above ₹10L</option>
            </select>
          </div>

          <button type="submit">Create Account</button>

          <p className="signin">
            Already have an account? <a href="#">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;