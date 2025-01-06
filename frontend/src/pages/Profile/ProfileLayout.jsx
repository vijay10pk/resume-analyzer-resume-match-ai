import { Outlet } from "react-router-dom";
import SideBar from "../../components/Bars/SideBar";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../store/user-slice";
import { useEffect } from "react";
const ProfileLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
    console.log("hi");
  }, [dispatch]);
  return (
    <>
      <div className="h-screen flex bg-white text-black">
        <SideBar />

        <div className=" flex-1 flex flex-col  p-4 ">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default ProfileLayout;
