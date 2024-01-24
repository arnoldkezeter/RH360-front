import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    id: string,
    email: string;
    role: string;
    username: string;
}

export interface PropsUserState {
    id: string,
    email: string;
    role: string;
    username: string;
}

const initialState: UserState = {
    id: '',
    email: "",
    role: "",
    username: '',
};

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<PropsUserState>) => {
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.username = action.payload.username;
            state.id = action.payload.id;
        },



    },
});

export const {
    setUser,
} = userSlice.actions;

export default userSlice.reducer;
