import { createSlice, PayloadAction } from "@reduxjs/toolkit";



// Initial state
const initialState: ServiceInitialData = {
    data: {
        services: [],
        currentPage: 0,
        totalItems: 0,
        totalPages: 0,
        pageSize:0,
    },
    pageIsLoading: false,
    pageError: null,
};

// Création du slice
const serviceSlice = createSlice({
    name: "serviceSlice",
    initialState,
    reducers: {
        setServiceLoading(state, action: PayloadAction<boolean>) {
            state.pageIsLoading = action.payload;
        },
        setErrorPageService(state, action: PayloadAction<string | null>) {
            state.pageError = action.payload;
        },
        setServices(state, action: PayloadAction<ServiceReturnGetType>) {
            state.data = action.payload;
        },
        createServiceSlice(state, action: PayloadAction<CreateServicePayload>) {
            state.data.services.unshift(action.payload.service);
        },
        updateServiceSlice(state, action: PayloadAction<UpdateServicePayload>) {
            const { id, serviceData } = action.payload;
            const index = state.data.services.findIndex(e => e._id === id);
            if (index !== -1) {
                state.data.services[index] = { ...state.data.services[index], ...serviceData };
            }
        },
        deleteServiceSlice(state, action: PayloadAction<DeleteServicePayload>) {
            const { id } = action.payload;
            state.data.services = state.data.services.filter(e => e._id !== id);
        },
    },
});

// Actions exportées
export const {
    setServiceLoading,
    setErrorPageService,
    setServices,
    createServiceSlice,
    updateServiceSlice,
    deleteServiceSlice
} = serviceSlice.actions;

// Reducer exporté
export default serviceSlice.reducer;