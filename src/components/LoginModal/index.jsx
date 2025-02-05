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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
  <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Admin Login</h2>
    <div>
      <label htmlFor="email" className="block text-sm font-bold mb-2 text-gray-600">Email:</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
        placeholder="Enter your email"
      />
    </div>
    <div className="mt-4">
      <label htmlFor="password" className="block text-sm font-bold mb-2 text-gray-600">Password:</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
        placeholder="Enter your password"
      />
    </div>
    <button
      type="submit"
      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
    >
      Login
    </button>
  </form>
</div>

    );
  };
  
export default LoginModal;