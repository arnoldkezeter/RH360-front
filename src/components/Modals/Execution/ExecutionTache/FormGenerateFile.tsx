import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { executerTacheTheme } from '../../../../services/elaborations/tacheThemeFormationAPI';
import { RootState } from '../../../../_redux/store';
import { setShowModalGenerateDoc } from '../../../../_redux/features/setting';
import createToast from '../../../../hooks/toastify';
import CustomDialogModal from '../../CustomDialogModal';
import { updateTacheThemeFormationSlice } from '../../../../_redux/features/elaborations/tacheThemeFormationSlice';
import { FileText, FileSpreadsheet } from 'lucide-react';



function FormGenerateFile({ tache }: { tache: TacheThemeFormation | undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openGenerateDoc);
    const [modalTitle, setModalTitle] = useState("");

    const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState<'success' | 'error' | ''>('');

    // Initialisation du titre du modal
    useEffect(() => {
        setModalTitle(t('label.generer_fichier'));
    }, [t]);

    const closeModal = () => {
        setSelectedFormat(null);
        setGenerationStatus('');
        setIsGenerating(false);
        dispatch(setShowModalGenerateDoc());
    };

    // Simulation de la génération de fichier
    const handleGenerate = async () => {
        if (!selectedFormat || !tache) return;

        setIsGenerating(true);
        setGenerationStatus('');

        try {
            // Remplacez cette simulation par votre vraie logique d'API de génération de fichier
            // Par exemple : await generateFileAPI(tache._id, selectedFormat);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simuler un téléchargement
            const dummyFileUrl = `https://example.com/download-${selectedFormat}`;
            window.open(dummyFileUrl, '_blank');

            setGenerationStatus('success');

        } catch (error) {
            setGenerationStatus('error');
            console.error('Erreur de génération:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCompleteTask = async () => {
        if (!tache || !tache._id || !currentUser._id) return;
        setIsLoading(true);
        try {
            const response = await executerTacheTheme({
                tacheId: tache.tache._id||"",
                themeId: tache.theme?._id||"",
                statut: "EN_ATTENTE",
                lang
            });

            if (response.success) {
                createToast(response.message, '', 0);
                dispatch(updateTacheThemeFormationSlice({
                    id: response.data.tache._id,
                    tacheThemeFormationData: response.data
                }));
                closeModal();
            } else {
                createToast(response.message, '', 2);
            }
        } catch (e: any) {
            createToast(e.response?.data?.message || t('errors.api_error'), '', 2);
        }finally{
            setIsLoading(false)
        }
    };

    return (
        <CustomDialogModal
            title={modalTitle}
            isModalOpen={isModalOpen}
            isDelete={false}
            closeModal={closeModal}
            isLoading={isLoading}
            handleConfirm={handleCompleteTask}
            // Désactiver le bouton de confirmation tant qu'un format n'est pas généré avec succès
        >                
                
            <div className="flex justify-center space-x-4 mb-6">
                <button
                    onClick={() => setSelectedFormat('pdf')}
                    className={`px-6 py-4 rounded-lg transition-all duration-200 border-2 ${
                        selectedFormat === 'pdf' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                >
                    <FileText className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">PDF</span>
                </button>
                <button
                    onClick={() => setSelectedFormat('excel')}
                    className={`px-6 py-4 rounded-lg transition-all duration-200 border-2 ${
                        selectedFormat === 'excel' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                    }`}
                >
                    <FileSpreadsheet className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Excel</span>
                </button>
            </div>

        </CustomDialogModal>
    );
}

export default FormGenerateFile;