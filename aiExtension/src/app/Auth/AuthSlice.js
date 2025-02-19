import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: null,
    loading: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setName: (state, action) => {
            state.loading = true;
            state.name = action.payload;
        },
        clearName: (state) => {
            state.name = null;
        },

    },
})

// Action creators are generated for each case reducer function
export const { setName, clearName } = authSlice.actions

export default authSlice.reducer