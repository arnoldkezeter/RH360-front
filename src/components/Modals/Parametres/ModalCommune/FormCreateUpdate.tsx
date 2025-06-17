import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { setDepartementLoading, setDepartements, setErrorPageDepartement } from '../../../../_redux/features/parametres/departementSlice';
import { getDepartementsForDropDown } from '../../../../services/settings/departementAPI';
import { createCommune, updateCommune } from '../../../../services/settings/communeAPI';
import { createCommuneSlice, updateCommuneSlice } from '../../../../_redux/features/parametres/communeSlice';


function ModalCreateUpdate({ commune, onCommuneUpdated }: { commune: Commune | null, onCommuneUpdated: () => void; }) {
    const { data: { regions } } = useSelector((state: RootState) => state.regionSlice) ?? [];
    const { data: { departements } } = useSelector((state: RootState) => state.departementSlice) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorRegion, setErrorRegion] = useState("");
    const [errorDepartement, setErrorDepartement] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);
    // fournira les donnees a la page
    const [filteredDepartement, setFilteredDepartement] = useState<Departement[] | undefined>([]);
    useEffect(() => {
        if (commune) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.commune'));
           
            setCode(commune?.code || "");
            setNomFr(commune.nomFr);
            setNomEn(commune.nomEn);
            setRegion(commune.departement.region);
            setDepartement(commune.departement);


        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.commune'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setRegion(undefined);
            setDepartement(undefined);
        }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("");
            setErrorRegion("");
            setErrorDepartement("");
            setIsFirstRender(false);
        }
    }, [commune, isFirstRender, t]);
    
    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorRegion("");
        setErrorDepartement("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };
    
    // filtrer les donnee a partir de l'id de la region selectionner

    const fetchDepartements = async (id: string | undefined) => {
        dispatch(setDepartementLoading(true));
        try {
            const fetchedDepartements = id && await getDepartementsForDropDown({regionId:id, lang });
            if (fetchedDepartements) {
                setFilteredDepartement(fetchedDepartements.departements)
            } else {
                dispatch(setDepartements({
                    departements: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            }
        } catch (error) {
            dispatch(setErrorPageDepartement(t('message.erreur')));
            createToast(t('message.erreur'), "", 2);
        } finally {
            dispatch(setDepartementLoading(false));
        }
    };

    
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionNom = e.target.value;
        var selectedRegion = null;

        if (lang === 'fr') {
            selectedRegion = regions.find(region => region.nomFr === selectedRegionNom);
        }else {
            selectedRegion = regions.find(region => region.nomEn === selectedRegionNom);
        }

        if (selectedRegion) {
            setRegion(selectedRegion);
            fetchDepartements(selectedRegion._id);
            setErrorRegion("");
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementNom = e.target.value;
        var selectedDepartement = null;

        if (lang === 'fr') {
            selectedDepartement = filteredDepartement && filteredDepartement.find(departement => departement.nomFr === selectedDepartementNom);
        }else {
            selectedDepartement = filteredDepartement && filteredDepartement.find(departement => departement.nomEn === selectedDepartementNom);
        }

        if (selectedDepartement) {
            setDepartement(selectedDepartement);
            setErrorDepartement("");
        }
    };




    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || !region || !departement) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
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
                await createCommune(
                    {
                        code,
                        nomFr,
                        nomEn,
                        departement,
                    }, lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createCommuneSlice({
                            commune: {
                                code: e.data.code,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                departement: departement,
                                _id: e.data._id,
                            }
                        }));
    
                        closeModal();
    
                    } else {
                        createToast(e.message, '', 2);
    
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
            }
        }else{
            if (departement._id) {
                await updateCommune(
                    {
                        code,
                        nomFr,
                        nomEn,
                        departement,
                        _id: commune._id,
                    }, lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateCommuneSlice({
                            id: e.data._id,
                            communeData: {
                                code: e.data.code,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                departement: departement,
                                _id: e.data._id,
                            }
                        }));

                        closeModal();
                        onCommuneUpdated(); // Appeler pour rafraîchir la liste

                    } else {
                        createToast(e.message, '', 2);

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
                    onChange={(e) => { setCode(e.target.value);}}
                />
                {/* {errorCode && <p className="text-red-500" >{errorCode}</p>} */}
                <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomFr}
                    onChange={(e) => { setNomFr(e.target.value); setErrorNomFr("") }}
                />
                {errorNomFr && <p className="text-red-500">{errorNomFr}</p>}
                <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomEn}
                    onChange={(e) => { setNomEn(e.target.value); setErrorNomFr("") }}
                />
                {errorNomEn && <p className="text-red-500">{errorNomEn}</p>}
                <label>{t('label.region')}</label><label className="text-red-500"> *</label>
                <select
                    value={region ? (lang === 'fr' ? region.nomFr : region.nomEn) : 'Sélectionnez une region'}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={lang === 'fr' ? region.nomFr : region.nomEn}>{lang === 'fr' ? region.nomFr : region.nomEn}</option>
                    ))}
                </select>
                {errorRegion && <p className="text-red-500">{errorRegion}</p>}
                <label>{t('label.departement')}</label><label className="text-red-500"> *</label>
                <select
                    value={departement ? (lang === 'fr' ? departement.nomFr : departement.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                    {filteredDepartement && filteredDepartement.map(departement => (
                        <option key={departement._id} value={lang === 'fr' ? departement.nomFr : departement.nomEn}>{lang === 'fr' ? departement.nomFr : departement.nomEn}</option>
                    ))}
                </select>
                {errorDepartement && <p className="text-red-500">{errorDepartement}</p>}
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
