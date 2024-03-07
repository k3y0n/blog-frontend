import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../axios";

export const userGetData = createAsyncThunk("auth/getUserData", async () => {
  const { data } = await api.get("/auth/me");
  return data;
});

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", params);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const userRegister = createAsyncThunk(
  "auth/userRegister",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", params);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer actions will be defined here
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [userGetData.pending]: (state) => {
      state.status = "loading";
    },
    [userGetData.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    [userGetData.rejected]: (state) => {
      state.item = [];
      state.status = "failed";
    },

    [userLogin.pending]: (state) => {
      state.status = "loading";
    },
    [userLogin.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    [userLogin.rejected]: (state) => {
      state.item = [];
      state.status = "failed";
    },

    [userRegister.pending]: (state) => {
      state.status = "loading";
    },
    [userRegister.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    [userRegister.rejected]: (state) => {
      state.item = [];
      state.status = "failed";
    },
  },
});

export const { logout } = authSlice.actions;

export const isAuthorized = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;
