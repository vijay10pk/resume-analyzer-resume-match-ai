import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { fullname: "", email: "", country: "", phone: "" },
  reducers: {
    loadUser(state, action) {
      const userData = action.payload;
      state.fullname = userData.fullname;
      state.email = userData.email;
      state.country = userData.country || "United States";
      state.phone = userData.phone;
    },
  },
});
export const fetchUserData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("backend-api", {
        method: "GET",
        headers: {
          authorization: "Bearer " + token,
        },
      });
      if (!response.ok) {
      }

      //   const userData = await response.json();
      const data = {
        fullname: "nikhil",
        email: "nikhil@abc.com",
        country: "United States",
        phone: "2608880000",
      };

      return data;
    };
    try {
      const userData = await fetchData();
      dispatch(userActions.loadUser(userData));
    } catch (err) {
      console.log(err);
    }
  };
};

export const userActions = userSlice.actions;
export default userSlice;
