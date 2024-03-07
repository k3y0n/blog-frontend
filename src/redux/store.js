import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/post";
import { authReducer } from "./slices/auth";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});
