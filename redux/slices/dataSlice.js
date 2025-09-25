import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // REST API data
  posts: [],
  users: [],
  comments: [],

  // GraphQL data
  countries: [],
  country: null,
  languages: [],

  // Loading states
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

    // REST API actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },

    // GraphQL actions
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },

    clearData: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setPosts,
  setUsers,
  setComments,
  setCountries,
  setCountry,
  setLanguages,
  clearData,
} = dataSlice.actions;

export default dataSlice.reducer;
