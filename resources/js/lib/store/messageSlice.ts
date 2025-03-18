import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface messageState {
    message: Message | null;
}

const initialState: messageState = {
    message: null,
};

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<Message | null>) => {
            state.message = action.payload;
        },
    },
});

export const { setMessage } = messageSlice.actions;

export default messageSlice.reducer;
