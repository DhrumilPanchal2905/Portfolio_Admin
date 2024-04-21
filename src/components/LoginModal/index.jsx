import React, { useState } from "react";

const LoginModal = ({ isVisible, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (
        email === process.env.NEXT_APP_EMAIL &&
        password === process.env.NEXT_APP_PASSWORD
      ) {
        onLogin();
      } else {
        alert("Invalid credentials!");
      }
    };
  
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg">
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-bold mb-2">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    );
  };
  
export default LoginModal;