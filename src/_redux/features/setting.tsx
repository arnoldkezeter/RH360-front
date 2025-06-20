import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SettingState {
    [x: string]: any;
    language: string;
    isMobile: boolean | null,
    periodeIndex : number,
    userPermissions:string[],
    selectedUserPermission:any,
    selectedUserRole:string,
    showModal: {
        create: boolean,
        update: boolean,
        delete: boolean,
        details:boolean,
        open: boolean,
        notificationDetails:boolean,
        openSignalerAbsence:boolean,
        openPause:boolean,
        openElement:boolean,
        openScan:boolean,
        openPresence:boolean,
        openPresenceM:boolean,
        addRole:boolean,
        openChapitre: boolean,
        openEnseignement:boolean,
        openPeriode:boolean,
        toDoSondage: boolean,
    };
    currentIndexUserRole: number,
}

const initialState: SettingState = {
    language: localStorage.getItem('lang')?.toString() || 'fr',
    isMobile: null,
    periodeIndex:-1,
    userPermissions:[],
    selectedUserPermission:undefined,
    selectedUserRole:"",
    showModal: {
        create: false,
        update: false,
        delete: false,
        details:false,
        open: false,
        notificationDetails:false,
        openSignalerAbsence:false,
        openPause:false,
        openElement:false,
        openPresence:false,
        openPresenceM:false,
        openScan:false,
        addRole:false,
        openChapitre: false,
        openEnseignement:false,
        openPeriode:false,
        toDoSondage: false,
    },
    currentIndexUserRole: 0,
};


export const settingSlice = createSlice({
    name: "settingSlice",
    initialState,
    reducers: {
        setSelectedUserPermission:(state, action: PayloadAction<any>)=>{
            state.selectedUserPermission = action.payload;
        },

        setSelectedUserRole:(state, action: PayloadAction<string>)=>{
            state.selectedUserRole = action.payload;
        },

        setUserPermission:(state, action: PayloadAction<string[]>)=>{
            state.userPermissions = action.payload;
        },
        
        addUserPemission(state, action: PayloadAction<string>) {
            state.userPermissions.unshift(action.payload);
        },
        
        removeUserPemission(state, action: PayloadAction<string>) {
            state.userPermissions = state.userPermissions.filter(up => up !== action.payload);
        },

        setPeriodeIndex:(state, action: PayloadAction<number>)=>{
            console.log(action.payload)
            state.periodeIndex = action.payload;
        },

        setShowModalCreate: (state) => {
            state.showModal.create = !state.showModal.create;
        },

        // afficher ou fermer toutes les modal de l'application
        setCurrentIndexUserRole: (state, action) => {
            state.currentIndexUserRole = action.payload;
        },

        setShowModalUpdate: (state) => {
            state.showModal.update = !state.showModal.update;
        },
        setShowModalDelete: (state) => {
            state.showModal.delete = !state.showModal.delete;
        },
        setShowModalDetails: (state) => {
            state.showModal.details = !state.showModal.details;
        },

        setShowModalNotificationDetails: (state) => {
            state.showModal.notificationDetails = !state.showModal.notificationDetails;
        },

        setShowModal: (state) => {
            state.showModal.open = !state.showModal.open;
        },

        setShowModalSignalerAbsence: (state) => {
            state.showModal.openSignalerAbsence = !state.showModal.openSignalerAbsence;
        },

        setShowModalElement: (state) => {
            state.showModal.openElement = !state.showModal.openElement;
        },

        setShowModalPresence: (state) => {
            state.showModal.openPresence = !state.showModal.openPresence;
        },

        setShowModalPresenceManuelle: (state) => {
            state.showModal.openPresenceM = !state.showModal.openPresenceM;
        },

        setShowModalOpenScan: (state) => {
            state.showModal.openScan = !state.showModal.openScan;
        },

        setShowModalPause: (state) => {
            state.showModal.openPause = !state.showModal.openPause;
        },

        setShowRoleModal: (state) => {
            state.showModal.addRole = !state.showModal.addRole;
        },

        setShowModalToDOSondage: (state) => {
            state.showModal.toDoSondage = !state.showModal.toDoSondage;
        },

        setShowModalPeriode: (state, action:PayloadAction<boolean>) => {
            state.showModal.openPeriode = action.payload;
        },

        setShowLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload;
        },

        setSaveDeviceType: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },

        setShowModalDeleteCustom: (state, action: PayloadAction<boolean>) => {
            state.showModal.delete = action.payload;
        },

        setShowModalCustom: (state, action: PayloadAction<boolean>) => {
            state.showModal.open = action.payload;
        },
    },
});

export const {
    setPeriodeIndex,
    setShowModalDeleteCustom,
    setShowModalCustom,
    setShowLanguage, setShowModalCreate, setShowModalUpdate, setShowModalDelete, setShowModalDetails, setShowModal, setShowModalToDOSondage
    , setSaveDeviceType,setShowRoleModal, setShowModalPeriode, setShowModalElement, setShowModalPresence, setShowModalOpenScan, setShowModalPause, setShowModalNotificationDetails,
    setCurrentIndexUserRole,setShowModalSignalerAbsence, setShowModalPresenceManuelle, setUserPermission, addUserPemission, removeUserPemission, setSelectedUserPermission, setSelectedUserRole
} = settingSlice.actions;

// export const changeLanguage = createAction<string>('setting/changeLanguage');

// export const selectLanguage = (state: RootState) => state.setting.language;

export default settingSlice.reducer;

