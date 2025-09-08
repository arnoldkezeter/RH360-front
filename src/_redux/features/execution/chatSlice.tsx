import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ChatInitialData = {
    data: {
        chats: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const chatSlice = createSlice({
    name: "chatSlice",
    initialState,
    reducers: {
        setChatLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageChat(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setChats(state, action: PayloadAction<ChatReturnGetType>) {
            state.data = action.payload;
        },
        createChatSlice(state, action: PayloadAction<CreateChatPayload>) {
            state.data.chats.unshift(action.payload.chat);
        },
        updateChatSlice(state, action: PayloadAction<UpdateChatPayload>) {
            const { id, chatData } = action.payload;
            const index = state.data.chats.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.chats[index] = { ...state.data.chats[index], ...chatData };
            }
        },
        updateChatParticipants(state, action: PayloadAction<{ id: string; participants: Participant[] }>) {
            const { id, participants } = action.payload;
            const index = state.data.chats.findIndex(e => e._id === id);

            if (index !== -1) {
                const existing = state.data.chats[index].participants || [];
                state.data.chats[index].participants = [
                ...existing,
                ...participants.filter(
                    p => !existing.some(e => e.userId === p.userId) // éviter doublons
                ),
                ];
            }
        },

        removeChatParticipants(
            state,
            action: PayloadAction<{ id: string; participants: Participant[] }>
            ) {
            const { id, participants } = action.payload;
            const index = state.data.chats.findIndex(e => e._id === id);

            if (index !== -1) {
                const toRemoveIds = participants.map(p => p.userId);

                state.data.chats[index].participants =
                state.data.chats[index].participants?.filter(
                    p => !toRemoveIds.includes(p.userId)
                ) || [];
            }
            },


        deleteChatSlice(state, action: PayloadAction<DeleteChatPayload>) {
            const { id } = action.payload;
            state.data.chats = state.data.chats.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setChatLoading,
    setErrorPageChat,
    setChats,
    updateChatParticipants,
    removeChatParticipants,
    createChatSlice,
    updateChatSlice,
    deleteChatSlice
} = chatSlice.actions;

// Reducer exporté
export default chatSlice.reducer;