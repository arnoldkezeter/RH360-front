import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { createNoteServiceStage } from '../../../../services/notes/noteServiceAPI';

function FormCreateUpdateNoteStageBatch({
    note,
    stageId,
}: {
    note?: NoteService;
    stageId?: string;
}) {
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const userId = useSelector(
        (state: RootState) => state.utilisateurSlice.utilisateur._id
    );
    const dispatch = useDispatch();
    const isModalOpen = useSelector(
        (state: RootState) => state.setting.showModal.open
    );

    const [copieA, setCopieA] = useState('');
    const [designationTuteur, setDesignationTuteur] = useState('');
    const [miseEnOeuvre, setMiseEnOeuvre] = useState(
        'La Directrice des Affaires Générales'
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorCopieA, setErrorCopieA] = useState('');
    const [isFirstRender, setIsFirstRender] = useState(true);

    const modalTitle = note
        ? (t('form_update.enregistrer') || 'Modifier') +
          ' ' +
          (t('form_update.note') || 'la note')
        : (t('form_save.enregistrer') || 'Générer') +
          ' ' +
          (t('form_save.note') || 'la note');

    useEffect(() => {
        if (note) {
            setCopieA(note.copieA || '');
            setDesignationTuteur(note.designationTuteur || '');
            setMiseEnOeuvre(
                note.miseEnOeuvre || 'La Directrice des Affaires Générales'
            );
        } else {
            setCopieA('');
            setDesignationTuteur('');
            setMiseEnOeuvre('La Directrice des Affaires Générales');
        }
        if (isFirstRender) {
            setErrorCopieA('');
            setIsFirstRender(false);
        }
    }, [note, isFirstRender]);

    const closeModal = () => {
        setErrorCopieA('');
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleGenerate = async () => {
        if (!copieA) {
            setErrorCopieA(t('error.copie_a'));
            return;
        }
        setIsLoading(true);
        try {
            const result = await createNoteServiceStage(
                {
                    titreFr:"",
                    titreEn:"",
                    typeNote:"acceptation_stage", 
                    stage: stageId,
                    copieA,
                    designationTuteur,
                    miseEnOeuvre,
                    creePar: userId,
                    valideParDG: false,
                },
                lang
            );
            if (result.success !== false) {
                closeModal();
            } else {
                createToast(result.message || t('message.erreur'), '', 2);
            }
        } catch (err: any) {
            createToast(err.message || t('message.erreur'), '', 2);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CustomDialogModal
            title={modalTitle}
            isModalOpen={isModalOpen}
            isDelete={false}
            closeModal={closeModal}
            handleConfirm={handleGenerate}
            isLoading={isLoading}
        >
            <p className="text-sm text-[#6b7280] mb-4">
                {lang === 'fr'
                    ? 'Une seule note de service sera générée pour tous les stagiaires de ce stage.'
                    : 'A single service note will be generated for all interns of this internship.'}
            </p>

            <label className="block text-sm font-medium text-[#374151] mb-1">
                {t('label.copie_a')}{' '}
                <span className="text-red-500">*</span>
            </label>
            <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black
                         focus:border-primary dark:bg-meta-4 dark:text-white mb-1"
                type="text"
                value={copieA}
                onChange={(e) => {
                    setCopieA(e.target.value);
                    setErrorCopieA('');
                }}
                placeholder={t('label.placeholder_copie_a')}
            />
            {errorCopieA && <p className="text-red-500 text-sm mb-3">{errorCopieA}</p>}

            <label className="block text-sm font-medium text-[#374151] mt-3 mb-1">
                {t('label.designation_tuteur')}
            </label>
            <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black
                         focus:border-primary dark:bg-meta-4 dark:text-white"
                type="text"
                value={designationTuteur}
                onChange={(e) => setDesignationTuteur(e.target.value)}
            />

            <label className="block text-sm font-medium text-[#374151] mt-3 mb-1">
                {t('label.mise_oeuvre')}
            </label>
            <input
                className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black
                         focus:border-primary dark:bg-meta-4 dark:text-white"
                type="text"
                value={miseEnOeuvre}
                onChange={(e) => setMiseEnOeuvre(e.target.value)}
            />
        </CustomDialogModal>
    );
}

export default FormCreateUpdateNoteStageBatch;