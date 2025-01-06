import { useNavigate } from "react-router-dom";
const RightSection = () => {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/Signin");
  }
  return (
    <>
      <div className="flex flex-col w-2/5 items-center justify-center bg-gradient-to-tr from-teal-400 to-teal-600 text-white p-10">
        <h2 className="text-3xl font-bold mb-4"> Already a member?</h2>
        <p className="mb-6">Sign in to stay connected and discover more!</p>
        <button
          className="px-6 py-2 bg-white text-teal-600 font-semibold rounded-md"
          onClick={handleClick}
        >
          Sign In
        </button>
      </div>
    </>
  );
};
export default RightSection;
