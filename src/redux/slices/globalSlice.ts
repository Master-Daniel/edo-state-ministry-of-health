import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResetPasswordData {
    email: string;
    reset_token: string;
}

interface GlobalState {
    isSideBarOpen: boolean;
    resetPasswordData: ResetPasswordData;
}

const initialState: GlobalState = {
    isSideBarOpen: false,
    resetPasswordData: {
        email: '',
        reset_token: ''
    }
}

const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setResetPasswordData: (state, action: PayloadAction<Partial<ResetPasswordData>>) => {
            state.resetPasswordData = {...state.resetPasswordData, ...action.payload}
        },
        setSideBarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSideBarOpen = action.payload
        }
    }
});

export const { setResetPasswordData, setSideBarOpen } = globalSlice.actions;
export default globalSlice.reducer;