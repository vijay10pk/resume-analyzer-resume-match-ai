import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage, { SignInAction } from "./pages/LoginPage";
import SignUpPage, { SignUpAction } from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/Signin", element: <LoginPage />, action: SignInAction },
  { path: "/Signup", element: <SignUpPage />, action: SignUpAction },
  { path: "/home", element: <HomePage /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
