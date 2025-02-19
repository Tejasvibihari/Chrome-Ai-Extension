import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Import storage for local storage
import authReducer from "./Auth/AuthSlice";
import promptReducer from "./Prompt/PromptSlice";
import chatReducer from "./Chat/ChatSlice";
import settingReducer from "./Setting/SettingSlice";

// Persist config for auth
const authPersistConfig = {
    key: "auth",
    storage,
};

// Persist config for prompt
const promptPersistConfig = {
    key: "prompt",
    storage,
};
// Persist config for chat
const chatPersistConfig = {
    key: "chat",
    storage,
};
// Persist config for chat
const settingPersistConfig = {
    key: "setting",
    storage,
};

// Wrap reducers with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPromptReducer = persistReducer(promptPersistConfig, promptReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedSettingReducer = persistReducer(settingPersistConfig, settingReducer);

// Configure store
export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,  // Persisted Auth Reducer
        prompt: persistedPromptReducer, // Persisted Prompt Reducer
        chat: persistedChatReducer, // Persisted Chat Reducer
        setting: persistedSettingReducer, // Persisted Chat Reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for redux-persist
        }),
});

// Persist store
export const persistor = persistStore(store);
