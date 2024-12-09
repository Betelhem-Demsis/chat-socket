import React, { useState } from "react";
import axios from "axios";

const Register = ({ onRegister }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:3005/register", {
        phoneNumber,
        name,
      });

      if (response.status === 200) {
        onRegister(phoneNumber, name);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
