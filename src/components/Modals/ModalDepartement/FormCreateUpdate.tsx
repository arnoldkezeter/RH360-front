import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import createToast from '../../../hooks/toastify';
import { createDepartement, updateDepartement } from '../../../services/settings/departementAPI';
import { createDepartementSlice, updateDepartementSlice } from '../../../_redux/features/settings/departementSlice';


function ModalCreateUpdate({ departement, onDepartmentUpdated }: { departement: Departement | null, onDepartmentUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [region, setRegion] = useState<Region>();

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorRegion, setErrorRegion] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    const { data: { regions } } = useSelector((state: RootState) => state.regionSlice) ?? [];
    useEffect(() => {
        if (departement) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.departement'));
            
            console.log("open")
            setCode(departement?.code || "");
            setNomFr(departement.nomFr);
            setNomEn(departement.nomEn);
            setRegion(departement.region);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.departement'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setRegion(undefined);
        }
        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorRegion("");
            setIsFirstRender(false);
        }
    }, [departement, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorRegion("");
        setIsFirstRender(true);
        dispatch(setShowModal());
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
            setErrorRegion("");
        }
    };




    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || !region) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            if (!region) {
                setErrorRegion(t('error.region'));
            }
            return;
        } 
        // create
        if (!departement) {
            if (region._id) {
                await createDepartement(
                    {
                        code,
                        nomFr,
                        nomEn,
                        region: region,
                    },lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createDepartementSlice({
                            departement:{
                                code: e.data.code,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                region: region,
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
        }else {
            if (region._id) {
                await updateDepartement(
                    {
                        code,
                        nomFr,
                        nomEn,
                        region: region,
                        _id: departement._id,
                    }, lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateDepartementSlice({
                            id:e.data._id,
                            departementData:{
                                code: e.data.code,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                region: region,
                                _id: e.data._id,
                            }
                        }));
                        
                        closeModal();
                        onDepartmentUpdated(); // Appeler pour rafraîchir la liste
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

                {/* input 1 */}
                <Label text={t('label.code')} />
                <Input
                    value={code}
                    type='text'
                    setValue={(value) => { setCode(value);}}
                    hasBackground={true}
                />

                {/* input 2 */}
                <Label text={t('label.nom_chose_fr')} required />
                <Input
                    value={nomFr}
                    type='text'
                    setValue={(value) => { setNomFr(value); setErrorNomFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomFr} />

                {/* input 3 */}
                <Label text={t('label.nom_chose_en')} required />
                <Input
                    value={nomEn}
                    type='text'
                    setValue={(value) => { setNomEn(value); setErrorNomEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomEn} />

                {/* input 4 */}

                <Label text={t('label.region')} required />
                <select
                    value={region ? (lang === 'fr' ? region.nomFr : region.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={lang === 'fr' ? region.nomFr : region.nomEn}>{lang === 'fr' ? region.nomFr : region.nomEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorRegion} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
