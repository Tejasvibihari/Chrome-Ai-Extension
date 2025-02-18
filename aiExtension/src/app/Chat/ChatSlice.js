import { createSlice } from "@reduxjs/toolkit";

const initialSlice = {
    messages: [],
}

const chatSlice = createSlice({
    name: 'chat',
    initialState: initialSlice,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearChat: (state) => {
            state.messages = [];
        }
    }
})
const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;