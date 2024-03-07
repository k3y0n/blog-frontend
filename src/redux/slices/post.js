import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios";

export const getPosts = createAsyncThunk("posts/getPosts", async () => {
  const { data } = await api.get("/posts");
  return data;
});

export const deletePosts = createAsyncThunk("posts/deletePost", async (id) => {
  await api.delete(`/posts/${id}`);
});

export const getTags = createAsyncThunk("tags/getTags", async () => {
  const { data } = await api.get("/posts/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "",
  },
  tags: {
    items: [],
    status: "",
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
      state.posts.items = [];
      state.posts.status = "failed";
    },

    [getTags.pending]: (state) => {
      state.tags.status = "loading";
    },
    [getTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "succeeded";
    },
    [getTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "failed";
    },

    [deletePosts.pending]: (state) => {
      state.posts.status = "loading";
    },
    [deletePosts.fulfilled]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
      state.posts.status = "succeeded";
    },
    [deletePosts.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "failed";
    },
  },
});

export const postsReducer = postSlice.reducer;
