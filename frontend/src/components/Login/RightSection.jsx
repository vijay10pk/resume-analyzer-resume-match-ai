import { useNavigate } from "react-router-dom";

const RightSection = () => {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/Signup");
  }
  return (
    <>
      <div className="flex flex-col w-2/5 items-center justify-center bg-gradient-to-r from-teal-300 to-teal-600 text-white p-10">
        <h2 className="text-3xl font-bold mb-4">New Here?</h2>
        <p className="mb-6">
          Sign up and discover a great amount of new opportunities!
        </p>
        <button
          className="px-6 py-2 bg-white text-teal-600 font-semibold rounded-md"
          onClick={handleClick}
        >
          Sign Up
        </button>
      </div>
    </>
  );
};
export default RightSection;
