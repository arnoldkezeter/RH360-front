import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import { apiCreateDepartement, apiUpdateDepartement } from '../../../api/settings/api_departement';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';


function ModalCreateUpdate({ departement }: { departement: DepartementProps | null }) {
    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.regions) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [region, setRegion] = useState<CommonSettingProps>();

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorRegion, setErrorRegion] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (departement) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.departement'));
            const regionId = "" + departement.region;
            const currentRegion = regions.find(region => region._id === regionId);

            setCode(departement.code);
            setLibelleFr(departement.libelleFr);
            setLibelleEn(departement.libelleEn);
            setRegion(currentRegion);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.departement'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setRegion(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleEn("");
            setErrorLibelleFr("");
            setErrorRegion("");
            setIsFirstRender(false);
        }
    }, [departement, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorRegion("");
        setIsFirstRender(true);
        dispatch(setShowModal());
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
            setErrorRegion("");
        }
    };




    const handleCreateUpdate = async () => {
        // create
        if (!departement) {
            // if (!code || !libelleFr || !libelleEn || !region) {
            if (!libelleFr || !libelleEn || !region) {
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

            } else {
                // creation

                if (region._id) {
                    await apiCreateDepartement(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            region: region._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(createSettingItem({
                                tableName: 'departements', newItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    region: e.data.region,
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

        //update
        else {

            if (!libelleFr || !libelleEn || !region) {
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
            } else {


                //
                //  mise a jour
                if (region._id) {
                    await apiUpdateDepartement(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            region: region._id,
                            _id: departement._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(updateSettingItem({
                                tableName: 'departements',
                                updatedItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    region: e.data.region,
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
                    setValue={(value) => { setCode(value); setErrorCode("") }}
                    hasBackground={true}
                />
                {/* <ErrorMessage message={errorCode} /> */}


                {/* input 2 */}
                <Label text={t('label.libelle_fr')} required />
                <Input
                    value={libelleFr}
                    type='text'
                    setValue={(value) => { setLibelleFr(value); setErrorLibelleFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorLibelleFr} />

                {/* input 3 */}
                <Label text={t('label.libelle_en')} required />
                <Input
                    value={libelleEn}
                    type='text'
                    setValue={(value) => { setLibelleEn(value); setErrorLibelleEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorLibelleEn} />

                {/* input 4 */}

                <Label text={t('label.region')} required />


                <select
                    value={region ? (lang === 'fr' ? region.libelleFr : region.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={lang === 'fr' ? region.libelleFr : region.libelleEn}>{lang === 'fr' ? region.libelleFr : region.libelleEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorRegion} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;
