import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URLs
const API_BASE = "https://apis.allsoft.co/api/documentManagement";

// Thunks
export const generateOTP = createAsyncThunk(
  "auth/generateOTP",
  async (mobile_number, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/generateOTP`, {
        mobile_number,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to generate OTP");
    }
  }
);

export const validateOTP = createAsyncThunk(
  "auth/validateOTP",
  async ({ mobile_number, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/validateOTP`, {
        mobile_number,
        otp,
      });
      console.log("Validate OTP Response Data:", response.data); // DEBUG LOG
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response || error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate OTP";
      })
      .addCase(validateOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateOTP.fulfilled, (state, action) => {
        console.log("Full API Response:", action.payload);
        state.loading = false;
        // Handle potential response structures
        const token = action.payload.token || action.payload.data?.token || action.payload.result?.token;

        if (token) {
          state.token = token;
          localStorage.setItem("token", token);
        } else {
           // Fallback if token is missing but request succeeded (unlikely but possible)
           console.error("Token not found in response");
           state.error = "Login succeeded but token missing";
        }
      })
      .addCase(validateOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
