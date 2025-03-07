import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ConversationState {
    data: Conversation | null;
}

const initialState: ConversationState = {
    data: null,
};

export const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {
        setConversation: (
            state,
            action: PayloadAction<Conversation | null>
        ) => {
            state.data = action.payload;
        },
    },
});

export const { setConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
