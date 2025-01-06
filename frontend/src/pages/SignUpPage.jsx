import React from "react";

import SignupForm from "../components/Signup/SignupForm";
import RightSection from "../components/Signup/RightSection";
import { redirect } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full h-full shadow-lg  bg-white">
        {/* Left Section */}
        <SignupForm />
        <RightSection />
      </div>
    </div>
  );
};

export default SignUpPage;

export async function SignUpAction({ request, params }) {
  const data = await request.formData();
  const password = data.get("Password");
  const confirmPassword = data.get("Confirm Password");
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  const reqData = {
    email: data.get("email"),
    password: data.get("password"),
  };
  console.log(reqData);
  const response = await fetch("backend-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqData),
  });
  if (!response.ok) {
  }
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);
  return redirect("/home");
}
