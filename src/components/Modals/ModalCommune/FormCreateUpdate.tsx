import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import { apiCreateCommune, apiUpdateCommune } from '../../../services/settings/api_commune';
import createToast from '../../../hooks/toastify';


function ModalCreateUpdate({ commune }: { commune: CommuneProps | null }) {
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departements) ?? [];
    const regions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.regions) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<DepartementProps>();

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorRegion, setErrorRegion] = useState("");
    const [errorDepartement, setErrorDepartement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);
    // fournira les donnees a la page
    const [filteredDepartement, setFilteredDepartement] = useState<DepartementProps[] | undefined>([]);
    useEffect(() => {
        if (commune) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.commune'));
            const currentDepartement = departements.find(departement => departement._id === ""+commune.departement);
            const currentRegion = currentDepartement && regions.find(region => region._id === ""+currentDepartement.region);
            currentRegion && filterDepartementByRegion(currentRegion._id);
            setCode(commune.code);
            setLibelleFr(commune.libelleFr);
            setLibelleEn(commune.libelleEn);
            setRegion(currentRegion);
            setDepartement(currentDepartement);


        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.commune'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setRegion(undefined);
            setDepartement(undefined);
            setFilteredDepartement(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setErrorRegion("");
            setErrorDepartement("");
            setIsFirstRender(false);
        }
    }, [commune, isFirstRender, t]);
    
    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorRegion("");
        setErrorDepartement("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };
    
    // filtrer les donnee a partir de l'id de la region selectionner
    const filterDepartementByRegion = (regionId: string | undefined) => {
        if (regionId && regionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: DepartementProps[] = departements.filter(depart => ""+depart.region === regionId);

            setFilteredDepartement(result);
        }
    };

    
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionLibelle = e.target.value;
        var selectedRegion = null;

        if (lang === 'fr') {
            selectedRegion = regions.find(region => region.libelleFr === selectedRegionLibelle);

        }
        else {
            selectedRegion = regions.find(region => region.libelleEn === selectedRegionLibelle);

        }


        if (selectedRegion) {
            setRegion(selectedRegion);
            filterDepartementByRegion(selectedRegion._id);
            setErrorRegion("");
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        var selectedDepartement = null;

        if (lang === 'fr') {
            selectedDepartement = filteredDepartement && filteredDepartement.find(departement => departement.libelleFr === selectedDepartementLibelle);

        }
        else {
            selectedDepartement = filteredDepartement && filteredDepartement.find(departement => departement.libelleEn === selectedDepartementLibelle);

        }


        if (selectedDepartement) {
            setDepartement(selectedDepartement);
            setErrorDepartement("");
        }
    };




    const handleCreateUpdate = async () => {
        if (!libelleFr || !libelleEn || !region || !departement) {
            // if (!code) {
            //     setErrorCode(t('error.code'));
            // }
            if (!libelleFr) {
                setErrorLibelleFr(t('error.libelle'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.libelle'));
            }
            if (!region) {
                setErrorRegion(t('error.region'));
            }
            if (!departement) {
                setErrorDepartement(t('error.departement'));
            }
            return;
        }
        if (!commune){
            if (departement._id) {
                await apiCreateCommune(
                    {
                        code,
                        libelleFr,
                        libelleEn,
                        departement: departement._id,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createSettingItem({
                            tableName: 'communes', newItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                date_creation: e.data.date_creation,
                                departement: e.data.departement,
                                _id: e.data._id,
                            }
                        }));
    
                        closeModal();
    
                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
    
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }else{
            if (departement._id) {
                await apiUpdateCommune(
                    {
                        code,
                        libelleFr,
                        libelleEn,
                        departement: departement._id,
                        _id: commune._id,
                    }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(updateSettingItem({
                            tableName: 'communes',
                            updatedItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                date_creation: e.data.date_creation,
                                departement: e.data.departement,
                                _id: e.data._id,
                            }
                        }));

                        closeModal();


                    } else {
                        createToast(e.message[lang as keyof typeof e.message], '', 2);

                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }
        

    }

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >

                <label>{t('label.code')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setErrorCode("") }}
                />
                {/* {errorCode && <p className="text-red-500" >{errorCode}</p>} */}
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr("") }}
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleFr("") }}
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
                <label>{t('label.region')}</label><label className="text-red-500"> *</label>
                <select
                    value={region ? (lang === 'fr' ? region.libelleFr : region.libelleEn) : 'Sélectionnez une region'}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={lang === 'fr' ? region.libelleFr : region.libelleEn}>{lang === 'fr' ? region.libelleFr : region.libelleEn}</option>
                    ))}
                </select>
                {errorRegion && <p className="text-red-500">{errorRegion}</p>}
                <label>{t('label.departement')}</label><label className="text-red-500"> *</label>
                <select
                    value={departement ? (lang === 'fr' ? departement.libelleFr : departement.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                    {filteredDepartement && filteredDepartement.map(departement => (
                        <option key={departement._id} value={lang === 'fr' ? departement.libelleFr : departement.libelleEn}>{lang === 'fr' ? departement.libelleFr : departement.libelleEn}</option>
                    ))}
                </select>
                {errorDepartement && <p className="text-red-500">{errorDepartement}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
