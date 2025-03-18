import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface conversationFormState {
    showForm: boolean;
    trafficNumber: string | null;
    messages: Message[];
    conversation: Conversation | null;
}

const initialState: conversationFormState = {
    showForm: false,
    messages: [],
    conversation: null,
    trafficNumber: null,
};

export const conversationFormSlice = createSlice({
    name: "conversationForm",
    initialState,
    reducers: {
        setShowForm: (state, action: PayloadAction<boolean>) => {
            state.showForm = action.payload;
        },

        setTrafficNumber: (state, action: PayloadAction<string | null>) => {
            state.trafficNumber = action.payload;
        },

        setConversation: (
            state,
            action: PayloadAction<Conversation | null>
        ) => {
            state.conversation = action.payload;
        },

        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
    },
});

export const { setShowForm, setConversation, setMessages, setTrafficNumber } =
    conversationFormSlice.actions;

export default conversationFormSlice.reducer;
