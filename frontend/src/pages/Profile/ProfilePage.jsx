import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex-1 flex flex-col place-content-center items-center">
        <div className="  bg-white border-2 shadow-lg rounded-3xl p-12 w-3/4">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="fullName-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {userData.fullname}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {userData.email}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {userData.phone}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <p className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {userData.country}
                </p>
              </div>
              <button
                type="submit"
                className=" bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600"
                onClick={() => navigate("/Profile/Edit")}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
