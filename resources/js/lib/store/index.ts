import { configureStore } from "@reduxjs/toolkit";
import addConversationSlice from "./addConversationSlice";
import messageSlice from "./messageSlice";

export const store = configureStore({
    reducer: {
        addConversation: addConversationSlice,
        message: messageSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
