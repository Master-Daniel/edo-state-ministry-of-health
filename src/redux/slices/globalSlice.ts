import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResetPasswordData {
    email: string;
    reset_token: string;
}

interface distribution {
    month: string;
    average_percentage: number;
    total_evaluation: number;
}

interface Stats {
    total_evaluation: number;
    new_evaluations: number;
    average_score: number;
    evaluated_centers: number;
    monthly_evaluation_distribution: distribution[]
}

interface GlobalState {
    isLoggedIn: boolean;
    isSideBarOpen: boolean;
    stats?: Stats;
    resetPasswordData: ResetPasswordData;
}

const initialState: GlobalState = {
    isLoggedIn: false,
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
        setStats: (state, action: PayloadAction<Stats>) => {
            state.stats = action.payload
        },
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        },
        setSideBarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSideBarOpen = action.payload
        }
    }
});

export const { setResetPasswordData, setSideBarOpen, setStats, setIsLoggedIn } = globalSlice.actions;
export default globalSlice.reducer;