import { USER_ROLES } from "@/constants";
import { createSlice } from "@reduxjs/toolkit";

interface AuthUserData {
  _id: string;
  role: USER_ROLES;
  email: string;
}

const initialState: AuthUserData | null = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    print: (state, action) => {
      console.log("Auth state:", JSON.stringify(state, null, 2));
    },
  },
});

export const { print } = authSlice.actions;
export default authSlice.reducer;
