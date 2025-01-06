import EditProfileForm from "../../components/Profile/EditProfileForm";
const EditProfile = () => {
  return (
    <>
      <div className="flex-1 flex flex-col place-content-center items-center">
        <div className="  bg-white border-2 shadow-lg rounded-3xl p-12 w-3/4">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
            <EditProfileForm />
          </div>
        </div>
      </div>
    </>
  );
};
export default EditProfile;
