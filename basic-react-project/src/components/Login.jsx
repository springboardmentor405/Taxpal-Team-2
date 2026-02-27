import { useState } from "react";
import "./Login.css";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      alert("Please fill all fields");
    } else {
      alert(`Welcome ${username}! Login Successful 🚀`);
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2>TaxPal</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="extra">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit">Sign In</button>

          <p className="signup">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;