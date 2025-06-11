import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: GradeInitialData = {
    data: {
        grades: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const gradeSlice = createSlice({
    name: "gradeSlice",
    initialState,
    reducers: {
        setGradeLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageGrade(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setGrades(state, action: PayloadAction<GradeReturnGetType>) {
            state.data = action.payload;
        },
        createGradeSlice(state, action: PayloadAction<CreateGradePayload>) {
            state.data.grades.unshift(action.payload.grade);
        },
        updateGradeSlice(state, action: PayloadAction<UpdateGradePayload>) {
            const { id, gradeData } = action.payload;
            const index = state.data.grades.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.grades[index] = { ...state.data.grades[index], ...gradeData };
            }
        },
        deleteGradeSlice(state, action: PayloadAction<DeleteGradePayload>) {
            const { id } = action.payload;
            state.data.grades = state.data.grades.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setGradeLoading,
    setErrorPageGrade,
    setGrades,
    createGradeSlice,
    updateGradeSlice,
    deleteGradeSlice
} = gradeSlice.actions;

// Reducer exporté
export default gradeSlice.reducer;