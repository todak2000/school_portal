/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  adminLogin,
  getUserDataConcurrently,
  signingOut,
} from "@/firebase/onboarding";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface AuthState {
  user: Record<string, any> | null;
  loading: boolean;
  error: string | null;
  role: "admin" | "student" | "teacher" | "parent" | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  role: null,
};

// Thunk for user login
export const loginUser = createAsyncThunk<
  Record<string, any>,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const { email, password } = credentials;
    const userCredential = await adminLogin({ email, password });
    const userData = userCredential
      ? await getUserDataConcurrently(userCredential.userId as string)
      : null;

    // Save user data to local storage
    if (userData && typeof window !== "undefined") {
      window.localStorage.setItem("aks_portal_user", JSON.stringify(userData));
    }

    return userData;
  } catch (error: any) {
    let message = "An error occurred during login.";
    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      message = "Invalid email or password.";
    }
    return thunkAPI.rejectWithValue(message);
  }
});

// Thunk for user logout
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await signingOut();
      // Remove user data from local storage
      typeof window !== "undefined" && window.localStorage.removeItem("user");
    } catch (error: any) {
      console.log("Logout failed:", error);
      return thunkAPI.rejectWithValue("Failed to logout.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Record<string, any> | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.role = action.payload ? action.payload.role : null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Handle loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<Record<string, any>>) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.role = action.payload ? action.payload.role : null;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed.";
    });

    // Handle logoutUser
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.role = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Logout failed.";
    });
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
