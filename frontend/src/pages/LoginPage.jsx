import React from "react";
import { useActionData } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";
import RightSection from "../components/Login/RightSection";
import { redirect } from "react-router-dom";

const LoginPage = () => {
  const data = useActionData();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full h-full shadow-lg  bg-white">
        <LoginForm></LoginForm>
        <RightSection />
      </div>
    </div>
  );
};

export default LoginPage;

export async function SignInAction({ request, params }) {
  const data = await request.formData();
  console.log(data);
  const reqData = {
    email: data.get("Email"),
    password: data.get("Password"),
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
