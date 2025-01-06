import { useActionData, useNavigate } from "react-router-dom";
import NavBar from "../components/Bars/NavBar";
import SideBar from "../components/Bars/SideBar";
import ResumeUpload from "../components/ResumeUpload/resumeUpload";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { dummyActions } from "../store/dummy-slice";

const HomePage = () => {
  const data = useActionData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      console.log("hi");
      dispatch(dummyActions.LoadData(data));
      navigate("/Report");
    }
  }, [data]);
  return (
    <>
      <div className="h-screen flex bg-white text-black">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className=" flex-1 flex flex-col  p-4">
          <NavBar />
          <ResumeUpload />
        </div>
      </div>
    </>
  );
};
export default HomePage;

export async function AnalyzeAction({ request, params }) {
  const data = await request.formData();
  const token = localStorage.getItem("token");

  const reqData = {
    job: data.get("job"),
    file: data.get("file"),
    jobdescription: data.get("jobdescription"),
  };
  console.log(reqData);
  const response = await fetch("backend-api", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(reqData),
  });
  if (!response.ok) {
  }
  return reqData;
}
