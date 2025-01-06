import { Form } from "react-router-dom";
import { useSelector } from "react-redux";

const EditProfileForm = () => {
  const userData = useSelector((state) => state.user);
  return (
    <>
      <Form method="post" className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="fullName-input"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName-input"
            name="fullname"
            type="text"
            defaultValue={userData.fullname}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email-input"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email-input"
            name="email"
            type="email"
            defaultValue={userData.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="phone-input"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone-input"
            name="phone"
            type="text"
            defaultValue={userData.phone}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="country-input"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            id="country-input"
            name="country"
            type="text"
            defaultValue={userData.country}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className=" bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600"
        >
          Save Changes
        </button>
      </Form>
    </>
  );
};
export default EditProfileForm;
