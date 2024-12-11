import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-router-dom";
const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div className="flex flex-col w-3/5 p-10 justify-center items-center ">
        <h2 className="text-3xl font-bold mb-6">Login to Your Account</h2>

        <Form method="post" className="w-full  max-w-md">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            required
          />
          <div className="relative">
            <input
              name="password"
              type={isVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <FontAwesomeIcon icon={faEye} className="text-gray-500" />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} className="text-gray-500" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
          >
            Sign In
          </button>
          <hr className="my-7 h-0.5 border-t-0 bg-neutral-100 dark:bg-black/10" />
          <p className="mb-4 text-gray-600 text-center">
            Login using social networks
          </p>
          <div className="flex gap-4 mb-6 justify-center items-center">
            <button className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full">
              <i className="fab fa-facebook-f"></i>
            </button>
            <button className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full">
              <i className="fab fa-google"></i>
            </button>
            <button className="flex items-center justify-center w-12 h-12 bg-blue-800 text-white rounded-full">
              <i className="fab fa-linkedin-in"></i>
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};
export default LoginForm;
