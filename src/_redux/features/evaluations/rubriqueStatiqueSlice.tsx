// store/slices/rubriqueStatiqueSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RubriqueStatiqueInitialData {
    data: {
        rubriquesStatiques: RubriqueStatique[];
        currentPage: number;
        totalItems: number;
        totalPages: number;
        pageSize: number;
    };
    pageIsLoading: boolean;
    pageError: string | null;
    selectedRubriqueStatique: RubriqueStatique | undefined;
}

const initialState: RubriqueStatiqueInitialData = {
    data: {
        rubriquesStatiques: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize: 0,
    },
    pageIsLoading: false,
    pageError: null,
    selectedRubriqueStatique: undefined,
};

const rubriqueStatiqueSlice = createSlice({
    name: "rubriqueStatiqueSlice",
    initialState,
    reducers: {
        setRubriqueStatiqueSelected(state, action: PayloadAction<RubriqueStatique | undefined>) {
            state.selectedRubriqueStatique = action.payload;
        },
        setRubriqueStatiqueLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageRubriqueStatique(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setRubriquesStatiques(state, action: PayloadAction<{
            rubriquesStatiques: RubriqueStatique[];
            currentPage: number;
            totalItems: number;
            totalPages: number;
            pageSize: number;
        }>) {
            state.data = action.payload;
        },
        updateRubriqueStatiqueSlice(state, action: PayloadAction<{
            code: string;
            rubriqueData: Partial<RubriqueStatique>;
        }>) {
            const { code, rubriqueData } = action.payload;
            const index = state.data.rubriquesStatiques.findIndex(r => r.code === code);
            if (index !== -1) {
                state.data.rubriquesStatiques[index] = { 
                    ...state.data.rubriquesStatiques[index], 
                    ...rubriqueData 
                };
            }
        },
        addQuestionStatiqueSlice(state, action: PayloadAction<{
            rubriqueCode: string;
            question: QuestionStatique;
        }>) {
            const { rubriqueCode, question } = action.payload;
            const rubrique = state.data.rubriquesStatiques.find(r => r.code === rubriqueCode);
            if (rubrique) {
                rubrique.questions.push(question);
                rubrique.questions.sort((a, b) => a.ordre - b.ordre);
            }
        },
        removeQuestionStatiqueSlice(state, action: PayloadAction<{
            rubriqueCode: string;
            questionCode: string;
        }>) {
            const { rubriqueCode, questionCode } = action.payload;
            const rubrique = state.data.rubriquesStatiques.find(r => r.code === rubriqueCode);
            if (rubrique) {
                rubrique.questions = rubrique.questions.filter(q => q.code !== questionCode);
            }
        },
        updateQuestionStatiqueSlice(state, action: PayloadAction<{
            rubriqueCode: string;
            questionCode: string;
            questionData: Partial<QuestionStatique>;
        }>) {
            const { rubriqueCode, questionCode, questionData } = action.payload;
            const rubrique = state.data.rubriquesStatiques.find(r => r.code === rubriqueCode);
            if (rubrique) {
                const question = rubrique.questions.find(q => q.code === questionCode);
                if (question) {
                    Object.assign(question, questionData);
                }
            }
        },
    },
});

export const {
    setRubriqueStatiqueSelected,
    setRubriqueStatiqueLoading,
    setErrorPageRubriqueStatique,
    setRubriquesStatiques,
    updateRubriqueStatiqueSlice,
    addQuestionStatiqueSlice,
    removeQuestionStatiqueSlice,
    updateQuestionStatiqueSlice,
} = rubriqueStatiqueSlice.actions;

export default rubriqueStatiqueSlice.reducer;