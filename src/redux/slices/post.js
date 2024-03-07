import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios";

export const getPosts = createAsyncThunk("posts/getPosts", async () => {
  const { data } = await api.get("/posts");
  return data;
});


export const getTags = createAsyncThunk("tags/getTags", async () => {
  const { data } = await api.get("/posts/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "idle",
  },
  tags: {
    items: [],
    status: "idle",
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Reducer actions will be defined here
  },
  extraReducers: {
    [getPosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [getPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "succeeded";
    },
    [getPosts.rejected]: (state) => {
      state.posts.item = [];
      state.posts.status = "failed";
    },
    [getTags.pending]: (state) => {
      state.posts.status = "loading";
    },
    [getTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.posts.status = "succeeded";
    },
    [getTags.rejected]: (state) => {
      state.posts.item = [];
      state.posts.status = "failed";
    },
  },
});

export const postsReducer = postSlice.reducer;
