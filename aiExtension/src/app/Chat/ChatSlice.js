import { createSlice } from "@reduxjs/toolkit";

const initialSlice = {
    messages: [],
    loading: false,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialSlice,
    reducers: {
        chatInitiate: (state) => {
            state.loading = true;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
            state.loading = false;
        },
        chatFailure: (state) => {
            state.loading = false;
        },
        clearChat: (state) => {
            state.messages = [];
        }
    }
})
export const { chatInitiate, chatFailure, addMessage, clearChat, } = chatSlice.actions;
export default chatSlice.reducer;