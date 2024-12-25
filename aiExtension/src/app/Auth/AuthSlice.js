import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    loading: false,

}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signup: (state, action) => {
            state.loading = true;
            state.user = action.payload;
        },
        siginStart: (state) => {
            state.loading = true;
        },
        signinSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        siginFailure: (state) => {
            state.loading = false;
        },

    },
})

// Action creators are generated for each case reducer function
export const { signup, signin } = authSlice.actions

export default authSlice.reducer