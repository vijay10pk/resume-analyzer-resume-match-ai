import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage, { AnalyzeAction } from "./pages/HomePage";
import LoginPage, { SignInAction } from "./pages/LoginPage";
import SignUpPage, { SignUpAction } from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import EditProfile from "./pages/Profile/EditProfile";
import ProfileLayout from "./pages/Profile/ProfileLayout";
import PasswordPage from "./pages/Profile/PasswordPage";
import { editprofileAction } from "./actions/editprofileAction";
import AuthCheck from "./utils/authCheck";
import ReportPage from "./pages/Profile/ReportPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/Signin", element: <LoginPage />, action: SignInAction },
  { path: "/Signup", element: <SignUpPage />, action: SignUpAction },
  { path: "/Home", element: <HomePage />, action: AnalyzeAction },
  {
    path: "/Profile",
    element: <ProfileLayout />,
    // loader: AuthCheck,
    children: [
      { index: true, element: <ProfilePage /> },
      {
        path: "Edit",
        element: <EditProfile />,
        action: editprofileAction,
      },
      { path: "Password-change", element: <PasswordPage /> },
    ],
  },
  { path: "/Report", element: <ReportPage /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
