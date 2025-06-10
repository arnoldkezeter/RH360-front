import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial state
const initialState: DataSettingSlice = {
    dataSetting: {
        services: [],
        fonctions: [],
        grades: [],
        categories: [],
        regions: [],
        departements: [],
        communes: [],
        departementsAcademique: [],
        promotions: [],
        sections: [],
        cycles: [],
        niveaux: [],
        sallesDeCours: [],
        typesEnseignement: [],
        etatsEvenement: [],
        anneeCourante: 2023,
        premiereAnnee: 2023,
        semestreCourant: 0,
        tauxHoraire: 0,
        // roles:[],
        __v: 0,
        specialites: []
    },
    loading: false,
    error: null,
};

// Création du slice
const dataSettingSlice = createSlice({
    name: "dataSettingSlice",
    initialState,
    reducers: {

        setLoadingDataSetting(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setErrorDataSetting(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        //
        //
        //
        //
        setDataSetting(state, action: PayloadAction<DataSettingProps>) {
            state.dataSetting = action.payload;
        },
        setSections(state, action:PayloadAction<SectionProps[]>){
            state.dataSetting.sections = action.payload;
        },
        setCycles(state, action:PayloadAction<CycleProps[]>){
            state.dataSetting.cycles = action.payload;
        },
        setNiveaux(state, action:PayloadAction<NiveauProps[]>){
            state.dataSetting.niveaux = action.payload;
        },
        setAnneeCourante(state, action:PayloadAction<number>){
            state.dataSetting.anneeCourante = action.payload;
        },
        setSemestreCourant(state, action:PayloadAction<number>){
            state.dataSetting.semestreCourant = action.payload;
        },
        setTauxHoraire(state, action:PayloadAction<number>){
            state.dataSetting.tauxHoraire = action.payload;
        },


        // create
        createSettingItem(state, action: PayloadAction<{
            tableName: keyof DataSettingProps; newItem: CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps | SalleDeCoursProps | CategorieProps
        }>) {
            const { tableName, newItem } = action.payload;

            const table = state.dataSetting[tableName] as (CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps | SalleDeCoursProps | CategorieProps)[];

            (state.dataSetting[tableName] as any) = [...table, newItem];
        },

      
        // update 
        updateSettingItem(state, action: PayloadAction<{ tableName: keyof DataSettingProps; updatedItem: CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps | SalleDeCoursProps | CategorieProps }>) {
            const { tableName, updatedItem } = action.payload;

            const table = state.dataSetting[tableName] as (CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps | SalleDeCoursProps | CategorieProps)[];

            const index = table.findIndex(item => item._id === updatedItem._id);
            if (index !== -1) {
                table[index] = updatedItem;
            } else {
                console.error("Item not found in the table:", updatedItem._id);
            }

            (state.dataSetting[tableName] as any) = [...table];
        },


        // Action pour supprimer un élément dans un tableau en fonction de son ID
        deleteSettingItem(state, action: PayloadAction<{ tableName: keyof DataSettingProps; itemId: string }>) {
            const { tableName, itemId } = action.payload;

            const table = state.dataSetting[tableName] as (CommonSettingProps | DepartementProps | CommuneProps | NiveauProps | CycleProps | SalleDeCoursProps)[];

            const index = table.findIndex((item) => item._id === itemId);
            if (index !== -1) {
                (state.dataSetting[tableName] as any) = table.filter((item) => item._id !== itemId);
            }
        },
    },
});

// Actions exportées
export const {
    setLoadingDataSetting,
    setErrorDataSetting,
    setDataSetting,
    //
    createSettingItem,
    updateSettingItem,
    deleteSettingItem,
    setSections,
    setCycles,
    setNiveaux,
    setAnneeCourante,
    setSemestreCourant,
    setTauxHoraire
    //
} = dataSettingSlice.actions;

// Reducer exporté
export default dataSettingSlice.reducer;
