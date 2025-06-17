import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: PosteDeTravailInitialData = {
    data: {
        posteDeTravails: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const posteDeTravailSlice = createSlice({
    name: "posteDeTravailSlice",
    initialState,
    reducers: {
        setPosteDeTravailLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPagePosteDeTravail(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setPosteDeTravails(state, action: PayloadAction<PosteDeTravailReturnGetType>) {
            state.data = action.payload;
        },
        createPosteDeTravailSlice(state, action: PayloadAction<CreatePosteDeTravailPayload>) {
            state.data.posteDeTravails.unshift(action.payload.posteDeTravail);
        },
        updatePosteDeTravailSlice(state, action: PayloadAction<UpdatePosteDeTravailPayload>) {
            const { id, posteDeTravailData } = action.payload;
            const index = state.data.posteDeTravails.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.posteDeTravails[index] = { ...state.data.posteDeTravails[index], ...posteDeTravailData };
            }
        },
        deletePosteDeTravailSlice(state, action: PayloadAction<DeletePosteDeTravailPayload>) {
            const { id } = action.payload;
            state.data.posteDeTravails = state.data.posteDeTravails.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setPosteDeTravailLoading,
    setErrorPagePosteDeTravail,
    setPosteDeTravails,
    createPosteDeTravailSlice,
    updatePosteDeTravailSlice,
    deletePosteDeTravailSlice
} = posteDeTravailSlice.actions;

// Reducer exporté
export default posteDeTravailSlice.reducer;