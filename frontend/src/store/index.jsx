import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice";
import dummySlice from "./dummy-slice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    dummy: dummySlice.reducer,
  },
});
export default store;
