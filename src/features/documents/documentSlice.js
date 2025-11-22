import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CRITICAL FIX: Space hataya hai end se
const API_BASE = "https://apis.allsoft.co/api/documentManagement";

// Async thunks
export const fetchTags = createAsyncThunk(
  "documents/fetchTags",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/documentTags`,
        { term: "" },
        { headers: { token } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch tags");
    }
  }
);

export const uploadFile = createAsyncThunk(
  "documents/uploadFile",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/saveDocumentEntry`,
        formData,
        {
          headers: {
            token: token,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

export const searchDocuments = createAsyncThunk(
  "documents/searchDocuments",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/searchDocumentEntry`,
        payload,
        { headers: { token } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Search failed");
    }
  }
);

const documentSlice = createSlice({
  name: "documents",
  initialState: {
    tags: [],
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = documentSlice.actions;
export default documentSlice.reducer;
