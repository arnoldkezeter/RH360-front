import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setShowModal } from '../../../_redux/features/setting';
import Input from '../../ui/input';
import { ErrorMessage, Label } from '../../ui/Label';
import { apiCreateGrade, apiUpdateGrade } from '../../../services/settings/api_grade';
import createToast from '../../../hooks/toastify';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';


function ModalCreateUpdate({ grade }: { grade: CommonSettingProps | null }) {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (grade) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.grade'));
            setCode(grade.code);
            setLibelleFr(grade.libelleFr);
            setLibelleEn(grade.libelleEn);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.grade'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
        }

        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleEn("");
            setErrorLibelleFr("");
            setIsFirstRender(false);
        }
    }, [grade, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        // create
        if (!grade) {
            if ( !libelleFr || !libelleEn) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }

            } else {
                // creation
                await apiCreateGrade(
                    { code, libelleFr, libelleEn }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(createSettingItem({
                            tableName: 'grades', newItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                date_creation: e.data.date_creation,
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

        //update
        else {

            if ( !libelleFr || !libelleEn) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }

            } else {
                //
                //
                // mise a jour
                await apiUpdateGrade(
                    { _id: grade._id, code, libelleFr, libelleEn }
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message[lang as keyof typeof e.message], '', 0);
                        dispatch(updateSettingItem({
                            tableName: 'grades',
                            updatedItem: {
                                code: e.data.code,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                date_creation: e.data.date_creation,
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

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

