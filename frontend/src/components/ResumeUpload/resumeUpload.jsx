import { Form } from "react-router-dom";

const ResumeUpload = () => {
  return (
    <>
      <div className="px-12">
        <Form method="post" encType="multipart/form-data">
          <main className=" flex flex-col space-y-4 p-8">
            <div>
              <label htmlFor="job">Job:</label>
              <input
                type="text"
                name="job"
                id="job"
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              ></input>
            </div>
            <div>
              <label htmlFor="pdf">Upload Resume: </label>
              <input
                name="file"
                type="file"
                id="pdf"
                accept="application/pdf"
                required
              />
            </div>
            <div>
              <label htmlFor="jobdescription">Job Description: </label>
              <textarea
                id="jobdescription"
                name="jobdescription"
                className="w-full h-72 flex-1 bg-teal-300 text-black rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 "
                required
                placeholder="Enter your text here..."
              />
            </div>
          </main>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-3/4 py-2 bg-teal-300 rounded hover:bg-teal-500"
            >
              Analyze
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ResumeUpload;
