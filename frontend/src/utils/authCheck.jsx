import { redirect } from "react-router-dom";

const AuthCheck = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/Signin");
  }
};

export default AuthCheck;
