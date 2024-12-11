import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  function loginHandler() {
    navigate("/Signin");
  }
  function signupHandler() {
    navigate("/Signup");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-teal-500">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4 text-teal-500">
          Welcome to Our Platform
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Login or sign up to discover new opportunities.
        </p>
        <div className="space-y-4">
          <button
            className="w-full py-2 px-4 bg-teal-500 text-white font-medium rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            onClick={loginHandler}
          >
            Login
          </button>
          <button
            className="w-full py-2 px-4 border border-teal-500 text-teal-500 font-medium rounded-md hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            onClick={signupHandler}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
