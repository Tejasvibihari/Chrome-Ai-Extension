import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    model: 'Auto',
    isSidebarVisible: false,
    context: false,
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
        setContext: (state) => {
            state.context = !state.context;
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

export const { setModel, clearData, setContext } = settingSlice.actions;
export default settingSlice.reducer;