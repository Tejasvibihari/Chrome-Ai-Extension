import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    data: {},

}

export const promptSlice = createSlice({
    name: 'prompt',
    initialState,
    reducers: {
        promptStart: (state) => {
            state.loading = true;
        },
        promptSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        promptFailure: (state) => {
            state.loading = false;
        },

    },
})

// Action creators are generated for each case reducer function
export const { promptStart, promptSuccess, promptFailure } = promptSlice.actions

export default promptSlice.reducer