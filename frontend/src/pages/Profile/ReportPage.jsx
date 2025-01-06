import { useSelector } from "react-redux";

const ReportPage = () => {
  const dummyData = useSelector((state) => state.dummy);
  return (
    <>
      <h1>Report Page</h1>
      <p>{dummyData.job}</p>
      <p>{dummyData.jobdescription}</p>
    </>
  );
};
export default ReportPage;
