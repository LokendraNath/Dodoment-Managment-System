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
      console.log("Upload Request - Token:", token ? "Present" : "Missing");
      console.log("Upload Request - FormData entries:");
      for (let pair of formData.entries()) {
        if (pair[0] === 'file') {
          console.log(`  ${pair[0]}:`, pair[1].name, pair[1].type);
        } else {
          console.log(`  ${pair[0]}:`, pair[1]);
        }
      }

      const response = await axios.post(
        `${API_BASE}/saveDocumentEntry`,
        formData,
        {
          headers: {
            token: token,
          },
        }
      );
      console.log("Upload Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

export const searchDocuments = createAsyncThunk(
  "documents/searchDocuments",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      console.log("Search Payload:", payload); // DEBUG LOG
      const response = await axios.post(
        `${API_BASE}/searchDocumentEntry`,
        payload,
        { headers: { token } }
      );
      console.log("Search Response:", response.data); // DEBUG LOG
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
        console.log("Search Fulfilled Payload:", action.payload);
        // Handle various response structures
        let results = [];
        if (Array.isArray(action.payload)) {
          results = action.payload;
        } else if (Array.isArray(action.payload?.data)) {
          results = action.payload.data;
        } else if (Array.isArray(action.payload?.results)) {
          results = action.payload.results;
        } else if (Array.isArray(action.payload?.documentList)) {
             results = action.payload.documentList;
        }

        state.searchResults = results;
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchResults } = documentSlice.actions;
export default documentSlice.reducer;
