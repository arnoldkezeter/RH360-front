import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateStatutTacheThemeFormation } from '../../../../services/elaborations/tacheThemeFormationAPI';
import { RootState } from '../../../../_redux/store';
import { setShowModalEmail } from '../../../../_redux/features/setting';
import createToast from '../../../../hooks/toastify';
import CustomDialogModal from '../../CustomDialogModal';
import { updateTacheThemeFormationSlice } from '../../../../_redux/features/elaborations/tacheThemeFormationSlice';
import { sendInvitations } from '../../../../services/elaborations/formationAPI';




function FormSendMessage({ tache }: { tache: TacheThemeFormation | undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const dispatch = useDispatch();

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openEmail);
    const [modalTitle, setModalTitle] = useState("");
    const [isParticipant, setIsParticipant] = useState('');

    const [message, setMessage] = useState('');
    const [sujet, setSujet] = useState('');
    const [sendStatus, setSendStatus] = useState<'success' | 'error' | ''>('');

    // Initialisation du titre du modal
    useEffect(() => {
        setModalTitle(t('label.envoyer_message'));
    }, [t]);

    const closeModal = () => {
        setMessage('');
        setIsParticipant('')
        setSujet('');
        setSendStatus('');
        dispatch(setShowModalEmail());
    };

    // Fonction de simulation de l'envoi de message
    const handleSendMessage = async () => {
        if (!message.trim() || !sujet.trim() || !isParticipant.trim()) {
            createToast(t('errors.message_vide'), '', 2);
            return;
        }

        setSendStatus('');

        try {
            // Remplacez cette simulation par votre vraie logique d'API
            const response = await sendInvitations({
                formationId: tache?.theme?.formation._id||"",
                sujet: sujet,
                content: message,
                lang,
                participant:isParticipant==='P'
            });
             if (response.success){
                handleCompleteTask();
             }
            
            setSendStatus('success');

        } catch (error) {
            setSendStatus('error');
            console.error('Erreur d\'envoi:', error);
            createToast(t('errors.envoi_erreur'), '', 2);
        } finally {
        }
    };

    const handleCompleteTask = async () => {
        if (!tache || !tache._id || !currentUser._id) return;

        try {
            const response = await updateStatutTacheThemeFormation({
                tacheId: tache._id,
                currentUser: currentUser._id,
                statut: "EN_ATTENTE",
                donnees: `message_sent`,
                lang
            });

            if (response.success) {
                createToast(response.message, '', 0);
                dispatch(updateTacheThemeFormationSlice({
                    id: response.data._id,
                    tacheThemeFormationData: {
                        ...tache,
                        statut: "EN_ATTENTE"
                    }
                }));
                closeModal();
            } else {
                createToast(response.message, '', 2);
            }
        } catch (e: any) {
            createToast(e.response?.data?.message || t('errors.api_error'), '', 2);
        }
    };

    return (
        <CustomDialogModal
            title={modalTitle}
            isModalOpen={isModalOpen}
            isDelete={false}
            closeModal={closeModal}
            handleConfirm={handleSendMessage}
            
        >
           
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.participant')}
                        name="formation"
                        value={t('label.participant')}
                        checked={isParticipant === "P"}
                        onChange={() => { setIsParticipant("P"); }}
                    />
                    <label htmlFor={t('label.participant')} className='radio-intern-space'>{t('label.participant')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.formateur')}
                        name="formation"
                        value={t('label.formateur')}
                        checked={isParticipant === "F"}
                        onChange={() => { setIsParticipant("F");}}
                    />
                    <label htmlFor={t('label.formateur')}>{t('label.formateur')}</label>
                </div>
                <label htmlFor="sujet-input" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('label.sujet')}
                </label>
                <input
                    id="sujet-input"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    // disabled={isSending}
                />
                <label htmlFor="message-input" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('label.votre_message')}
                </label>
                <textarea
                    id="message-input"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('label.saisir_message')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    // disabled={isSending}
                />

               
        </CustomDialogModal>
    );
}

export default FormSendMessage;