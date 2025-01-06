import { createSlice } from "@reduxjs/toolkit";

const dummySlice = createSlice({
  name: "dummy",
  initialState: { job: "", jobdescription: "" },
  reducers: {
    LoadData(state, action) {
      const data = action.payload;
      state.job = data.job;
      state.jobdescription = data.jobdescription;
    },
  },
});
export const dummyActions = dummySlice.actions;
export default dummySlice;
