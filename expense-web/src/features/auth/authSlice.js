import { createSlice } from "@reduxjs/toolkit";

const tokenSaved =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

const userSaved =
  localStorage.getItem("user") ||
  sessionStorage.getItem("user");

let parsedUser = null;

if (userSaved) {
  try {
    parsedUser = JSON.parse(userSaved);
  } catch (error) {
    console.error(
      "Lỗi parse thông tin user từ storage:",
      error
    );

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  }
}

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: tokenSaved || null,
    user: parsedUser,
    isAuthenticated: Boolean(tokenSaved),
  },

  reducers: {
    loginSuccess: (state, action) => {
      const {
        token,
        user,
        rememberMe,
      } = action.payload;

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "token",
        token
      );

      storage.setItem(
        "user",
        JSON.stringify(user)
      );
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };

      const updatedUser =
        JSON.stringify(state.user);

      if (
        localStorage.getItem("token")
      ) {
        localStorage.setItem(
          "user",
          updatedUser
        );
      }

      if (
        sessionStorage.getItem("token")
      ) {
        sessionStorage.setItem(
          "user",
          updatedUser
        );
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const {
  loginSuccess,
  updateUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;