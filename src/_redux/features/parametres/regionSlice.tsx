import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: RegionInitialData = {
    data: {
        regions: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const regionSlice = createSlice({
    name: "regionSlice",
    initialState,
    reducers: {
        setRegionLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageRegion(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setRegions(state, action: PayloadAction<RegionReturnGetType>) {
            state.data = action.payload;
        },
        createRegionSlice(state, action: PayloadAction<CreateRegionPayload>) {
            state.data.regions.unshift(action.payload.region);
        },
        updateRegionSlice(state, action: PayloadAction<UpdateRegionPayload>) {
            const { id, regionData } = action.payload;
            const index = state.data.regions.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.regions[index] = { ...state.data.regions[index], ...regionData };
            }
        },
        deleteRegionSlice(state, action: PayloadAction<DeleteRegionPayload>) {
            const { id } = action.payload;
            state.data.regions = state.data.regions.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setRegionLoading,
    setErrorPageRegion,
    setRegions,
    createRegionSlice,
    updateRegionSlice,
    deleteRegionSlice
} = regionSlice.actions;

// Reducer exporté
export default regionSlice.reducer;