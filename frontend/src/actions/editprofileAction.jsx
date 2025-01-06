import { redirect } from "react-router-dom";

export async function editprofileAction({ request, params }) {
  const data = await request.formData();

  const reqData = {
    fullname: data.get("fullname"),
    email: data.get("email"),
    country: data.get("country"),
    phone: data.get("phone"),
  };
  console.log(reqData);
  const token = localStorage.getItem("token");
  const response = await fetch("backend-api", {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(reqData),
  });
  if (!response.ok) {
  }

  return redirect("/home");
}
