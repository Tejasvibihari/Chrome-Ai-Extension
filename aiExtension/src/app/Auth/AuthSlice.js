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
        signin: (state, action) => {
            state.loading = true;
            state.user = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { signup, signin } = authSlice.actions

export default authSlice.reducer