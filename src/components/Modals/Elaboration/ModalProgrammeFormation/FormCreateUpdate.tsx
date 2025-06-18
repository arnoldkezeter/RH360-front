import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createProgrammeFormation, updateProgrammeFormation } from '../../../../services/elaborations/programmeFormationAPI';


function FormCreateUpdate({ 
    programmeFormation, 
    onAdd, 
    onUpdate 
}: { 
    programmeFormation: ProgrammeFormation | null; 
    onAdd: (programme: ProgrammeFormation) => void; 
    onUpdate: (programme: ProgrammeFormation) => void; 
}) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const [annee, setAnnee] = useState<number>();
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [errorAnnee, setErrorAnnee] = useState("");
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const lang = useSelector((state: RootState) => state.setting.language);

    // Initialisation des champs
    useEffect(() => {
        if (programmeFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.programme_formation'));
            setAnnee(programmeFormation.annee);
            setTitreFr(programmeFormation?.titreFr || "");
            setTitreEn(programmeFormation?.titreEn || "");
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.programme_formation'));
            setAnnee(undefined);
            setTitreFr("");
            setTitreEn("");
        }

        if (isFirstRender) {
            setErrorAnnee("");
            setIsFirstRender(false);
        }
    }, [programmeFormation, isFirstRender, t]);

    // Fermeture du modal
    const closeModal = () => {
        setErrorAnnee("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    // Validation et création/mise à jour
    const handleCreateUpdate = async () => {
        if (!annee) {
            setErrorAnnee(t('error.annee'));
            return;
        }

        const newProgramme: ProgrammeFormation = {
            _id: programmeFormation?._id || "",
            annee,
            titreFr,
            titreEn,
            creePar: userState,
        };

        if (!programmeFormation) {
            // Création
            try {
                const response = await createProgrammeFormation(newProgramme, lang);
                if (response.success) {
                    createToast(response.message, '', 0);
                    onAdd(response.data); // Ajout local
                    closeModal();
                } else {
                    createToast(response.message, '', 2);
                }
            } catch (error: any) {
                createToast(error.response?.data?.message || t('message.erreur'), '', 2);
            }
        } else {
            // Mise à jour
            try {
                const response = await updateProgrammeFormation(newProgramme, lang);
                if (response.success) {
                    createToast(response.message, '', 0);
                    onUpdate(response.data); // Mise à jour locale
                    closeModal();
                } else {
                    createToast(response.message, '', 2);
                }
            } catch (error: any) {
                createToast(error.response?.data?.message || t('message.erreur'), '', 2);
            }
        }
    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                <Label text={t('label.annee')} required />
                <Input
                    value={"" + (annee || "")}
                    type="number"
                    setValue={(value) => { setAnnee(parseInt(value)); setErrorAnnee(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorAnnee} />

                <Label text={t('label.titre_fr')} />
                <Input
                    value={titreFr}
                    type="text"
                    setValue={(value) => { setTitreFr(value); }}
                    hasBackground={true}
                />

                <Label text={t('label.titre_en')} />
                <Input
                    value={titreEn}
                    type="text"
                    setValue={(value) => { setTitreEn(value); }}
                    hasBackground={true}
                />
            </CustomDialogModal>
        </>
    );
}


export default FormCreateUpdate;
