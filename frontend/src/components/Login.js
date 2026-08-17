import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api-token-auth/",
        {
          username: username,
          password: password
        }
      );

      console.log("Login response:", response.data);

      localStorage.setItem("token", response.data.token);

      console.log(
        "Stored token:",
        localStorage.getItem("token")
      );

      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        console.error("Server response:", error.response.data);
        alert("Invalid username or password.");
      } else {
        alert("Could not connect to Django.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Taskly</h1>

        <p className="login-subtitle">
          Stay focused. Get things done.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;