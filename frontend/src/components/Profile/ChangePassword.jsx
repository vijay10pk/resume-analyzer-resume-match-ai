import { useActionData } from "react-router-dom";
import { Form } from "react-router-dom";
import PasswordInput from "../Inputs/PasswordInput";

const ChangePassword = () => {
  const data = useActionData();
  return (
    <>
      <div className="bg-white border-2 shadow-lg rounded-3xl p-12 w-3/4">
        <h2 className="text-2xl font-bold  mb-6">Change Password</h2>
        <Form method="post" className="w-full max-w-md space-y-4">
          <PasswordInput name="Current Password" />
          <PasswordInput name="New Password" />
          <PasswordInput name="Re-enter New Password"></PasswordInput>
          {data && data.error && (
            <p className="text-red-600 text-xs mb-4">Error : {data.error}</p>
          )}
          <button
            type="submit"
            className=" bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600"
          >
            Save Password
          </button>
        </Form>
      </div>
    </>
  );
};
export default ChangePassword;
