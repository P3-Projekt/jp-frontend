"use client";
import React, { useState } from "react";
import axios from "axios";

/**
 * Login form component.
 * @returns {JSX.Element} The login form.
 */
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle the form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Send the login request to the server
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password, // Send the plain password to the server
      });

      if (response.status === 200) {
        console.log("Login successful");
        console.log(response.data);
        setErrorMessage("Login successfull!");

        localStorage.setItem("authToken", response.data);

        // Try getting all users
        try {

            const authToken = localStorage.getItem("authToken");
            console.log(authToken);

            const responseUsers = await axios.get("http://localhost:8080/Users", {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },

              });

              console.log("Users: ", responseUsers.data);

        } catch (error) {
            setErrorMessage("Login failed. Please check your username and password.");
            console.error(error);
          }
        
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your username and password.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
