// store/slices/templateConfigSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TemplateConfigInitialData {
    config: TemplateConfig | null;
    rubriquesStatiques: RubriqueStatique[];
    objectifsBase: ObjectifTheme[];
    isLoading: boolean;
    error: string | null;
    isSaving: boolean;
}

const initialState: TemplateConfigInitialData = {
    config: null,
    rubriquesStatiques: [],
    objectifsBase: [],
    isLoading: false,
    error: null,
    isSaving: false,
};

const templateConfigSlice = createSlice({
    name: "templateConfigSlice",
    initialState,
    reducers: {
        setTemplateConfigLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setTemplateConfigSaving(state, action: PayloadAction<boolean>) {
            state.isSaving = action.payload;
        },
        setTemplateConfigError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setTemplateConfig(state, action: PayloadAction<{
            config: TemplateConfig;
            rubriquesStatiques: RubriqueStatique[];
            objectifsBase: ObjectifTheme[];
        }>) {
            state.config = action.payload.config;
            state.rubriquesStatiques = action.payload.rubriquesStatiques;
            state.objectifsBase = action.payload.objectifsBase;
        },
        updateRubriqueConfig(state, action: PayloadAction<{
            rubriqueReference: RubriqueReference;
            rubriqueConfig: Partial<RubriqueConfig>;
        }>) {
            if (!state.config) return;
            const { rubriqueReference, rubriqueConfig } = action.payload;
            const index = state.config.rubriquesConfig.findIndex(
                r => r.rubriqueReference === rubriqueReference
            );
            if (index !== -1) {
                state.config.rubriquesConfig[index] = {
                    ...state.config.rubriquesConfig[index],
                    ...rubriqueConfig,
                };
            } else {
                state.config.rubriquesConfig.push({
                    rubriqueReference,
                    estActive: true,
                    questionsPersonnalisees: [],
                    questionsSupprimees: [],
                    ...rubriqueConfig,
                });
            }
        },
        toggleRubriqueActive(state, action: PayloadAction<{
            rubriqueReference: RubriqueReference;
            estActive: boolean;
        }>) {
            if (!state.config) return;
            const { rubriqueReference, estActive } = action.payload;
            const index = state.config.rubriquesConfig.findIndex(
                r => r.rubriqueReference === rubriqueReference
            );
            if (index !== -1) {
                state.config.rubriquesConfig[index].estActive = estActive;
            } else {
                state.config.rubriquesConfig.push({
                    rubriqueReference,
                    estActive,
                    questionsPersonnalisees: [],
                    questionsSupprimees: [],
                });
            }
        },
        addQuestionPersonnalisee(state, action: PayloadAction<{
            rubriqueReference: RubriqueReference;
            question: QuestionPersonnalisee;
        }>) {
            if (!state.config) return;
            const { rubriqueReference, question } = action.payload;
            const rubriqueConfig = state.config.rubriquesConfig.find(
                r => r.rubriqueReference === rubriqueReference
            );
            if (rubriqueConfig) {
                rubriqueConfig.questionsPersonnalisees.push(question);
                rubriqueConfig.questionsPersonnalisees.sort((a, b) => a.ordre - b.ordre);
            } else {
                state.config.rubriquesConfig.push({
                    rubriqueReference,
                    estActive: true,
                    questionsPersonnalisees: [question],
                    questionsSupprimees: [],
                });
            }
        },
        removeQuestionPersonnalisee(state, action: PayloadAction<{
            rubriqueReference: string;
            questionId: string;
        }>) {
            if (!state.config) return;
            const { rubriqueReference, questionId } = action.payload;
            const rubriqueConfig = state.config.rubriquesConfig.find(
                r => r.rubriqueReference === rubriqueReference
            );
            if (rubriqueConfig) {
                rubriqueConfig.questionsPersonnalisees = rubriqueConfig.questionsPersonnalisees.filter(
                    q => q.id !== questionId
                );
            }
        },
        toggleQuestionSupprimee(state, action: PayloadAction<{
            rubriqueReference: RubriqueReference;
            questionCode: string;
            estSupprimee: boolean;
        }>) {
            if (!state.config) return;
            const { rubriqueReference, questionCode, estSupprimee } = action.payload;
            let rubriqueConfig = state.config.rubriquesConfig.find(
                r => r.rubriqueReference === rubriqueReference
            );
            if (!rubriqueConfig) {
                rubriqueConfig = {
                    rubriqueReference,
                    estActive: true,
                    questionsPersonnalisees: [],
                    questionsSupprimees: [],
                };
                state.config.rubriquesConfig.push(rubriqueConfig);
            }
            if (estSupprimee) {
                if (!rubriqueConfig.questionsSupprimees.includes(questionCode)) {
                    rubriqueConfig.questionsSupprimees.push(questionCode);
                }
            } else {
                rubriqueConfig.questionsSupprimees = rubriqueConfig.questionsSupprimees.filter(
                    code => code !== questionCode
                );
            }
        },
        updateObjectifsConfig(state, action: PayloadAction<Partial<ObjectifsConfig>>) {
            if (!state.config) return;
            state.config.objectifsConfig = {
                ...state.config.objectifsConfig,
                ...action.payload,
            };
        },
        addObjectifPersonnaliseConfig(state, action: PayloadAction<ObjectifPersonnalise>) {
            if (!state.config) return;
            if (!state.config.objectifsConfig) {
                state.config.objectifsConfig = {
                    estActive: true,
                    personnalisationAutorisee: true,
                    objectifsPersonnalises: [],
                    objectifsSupprimes: [],
                    objectifsPersonnalisesSupprimes: [],
                };
            }
            state.config.objectifsConfig.objectifsPersonnalises.push(action.payload);
            state.config.objectifsConfig.objectifsPersonnalises.sort((a, b) => a.ordre - b.ordre);
        },
        removeObjectifPersonnaliseConfig(state, action: PayloadAction<{ objectifId: string }>) {
            if (!state.config || !state.config.objectifsConfig) return;
            const { objectifId } = action.payload;
            state.config.objectifsConfig.objectifsPersonnalises = 
                state.config.objectifsConfig.objectifsPersonnalises.filter(
                    obj => obj.id !== objectifId
                );
            if (!state.config.objectifsConfig.objectifsPersonnalisesSupprimes) {
                state.config.objectifsConfig.objectifsPersonnalisesSupprimes = [];
            }
            state.config.objectifsConfig.objectifsPersonnalisesSupprimes.push(objectifId);
        },
        toggleObjectifBaseSupprime(state, action: PayloadAction<{ objectifId: string; estSupprime: boolean }>) {
            if (!state.config || !state.config.objectifsConfig) return;
            const { objectifId, estSupprime } = action.payload;
            if (!state.config.objectifsConfig.objectifsSupprimes) {
                state.config.objectifsConfig.objectifsSupprimes = [];
            }
            if (estSupprime) {
                if (!state.config.objectifsConfig.objectifsSupprimes.includes(objectifId)) {
                    state.config.objectifsConfig.objectifsSupprimes.push(objectifId);
                }
            } else {
                state.config.objectifsConfig.objectifsSupprimes = 
                    state.config.objectifsConfig.objectifsSupprimes.filter(id => id !== objectifId);
            }
        },
        resetTemplateConfig(state) {
            state.config = null;
            state.rubriquesStatiques = [];
            state.objectifsBase = [];
            state.isLoading = false;
            state.error = null;
            state.isSaving = false;
        },
    },
});

export const {
    setTemplateConfigLoading,
    setTemplateConfigSaving,
    setTemplateConfigError,
    setTemplateConfig,
    updateRubriqueConfig,
    toggleRubriqueActive,
    addQuestionPersonnalisee,
    removeQuestionPersonnalisee,
    toggleQuestionSupprimee,
    updateObjectifsConfig,
    addObjectifPersonnaliseConfig,
    removeObjectifPersonnaliseConfig,
    toggleObjectifBaseSupprime,
    resetTemplateConfig,
} = templateConfigSlice.actions;

export default templateConfigSlice.reducer;