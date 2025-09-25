import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: NoteServiceInitialData = {
    data: {
        noteServices: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedTheme:undefined
};

// Création du slice
const noteServiceSlice = createSlice({
    name: "noteServiceSlice",
    initialState,
    reducers: {
        setNoteServiceSelected(state, action: PayloadAction<NoteService | undefined>) {
            state.selectedTheme = action.payload;
        },
        setNoteServiceLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageNoteService(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setNoteServices(state, action: PayloadAction<NoteServiceReturnGetType>) {
            state.data = action.payload;
        },
        createNoteServiceSlice(state, action: PayloadAction<CreateNoteServicePayload>) {
            state.data.noteServices.unshift(action.payload.noteService);
        },
        updateNoteServiceSlice(state, action: PayloadAction<UpdateNoteServicePayload>) {
            const { id, noteServiceData } = action.payload;
            const index = state.data.noteServices.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.noteServices[index] = { ...state.data.noteServices[index], ...noteServiceData };
            }
        },
        deleteNoteServiceSlice(state, action: PayloadAction<DeleteNoteServicePayload>) {
            const { id } = action.payload;
            state.data.noteServices = state.data.noteServices.filter(e => e._id !== id);
        },

       
    
    },
});

// Actions exportées
export const {
    setNoteServiceSelected,
    setNoteServiceLoading,
    setErrorPageNoteService,
    setNoteServices,
    createNoteServiceSlice,
    updateNoteServiceSlice,
    deleteNoteServiceSlice,
    
} = noteServiceSlice.actions;

// Reducer exporté
export default noteServiceSlice.reducer;