import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordInput = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <div className="relative">
        <input
          name={props.name}
          type={isVisible ? "text" : "password"}
          placeholder={props.name}
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
    </>
  );
};
export default PasswordInput;
