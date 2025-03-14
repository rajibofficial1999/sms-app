import { configureStore } from "@reduxjs/toolkit";
import conversationFormSlice from "./conversationFormSlice";

export const store = configureStore({
    reducer: {
        conversationForm: conversationFormSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
