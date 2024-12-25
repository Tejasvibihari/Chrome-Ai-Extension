import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Auth/AuthSlice'
import promptReducer from './Prompt/PromptSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        prompt: promptReducer,
    },
})