import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    model: 'Auto',
    isSidebarVisible: false,
    chat: false,
    fullPageScan: false,
    viewScan: false,
    socialMedia: false,
};

const settingSlice = createSlice({
    name: 'setting',
    initialState,
    reducers: {
        setModel: (state, action) => {
            state.model = action.payload;
        },
        clearData: (state) => {
            state.model = "Auto";
            state.isSidebarVisible = false;
            state.chat = false;
            state.fullPageScan = false;
            state.viewScan = false;
            state.socialMedia = false
        }
    }
})

export const { setModel, clearData } = settingSlice.actions;
export default settingSlice.reducer;