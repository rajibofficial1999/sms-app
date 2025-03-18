import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface addConversationState {
    showForm: boolean;
    trafficNumber: string | null;
    messages: Message[];
    conversation: Conversation | null;
}

const initialState: addConversationState = {
    showForm: false,
    messages: [],
    conversation: null,
    trafficNumber: null,
};

export const addConversationSlice = createSlice({
    name: "addConversation",
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
    addConversationSlice.actions;

export default addConversationSlice.reducer;
