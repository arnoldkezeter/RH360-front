import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { executerTacheTheme } from '../../../../services/elaborations/tacheThemeFormationAPI';
import { RootState } from '../../../../_redux/store';
import { setShowModalCheckTask, setShowModalUploadDoc } from '../../../../_redux/features/setting';
import createToast from '../../../../hooks/toastify';
import CustomDialogModal from '../../CustomDialogModal';
import { updateTacheThemeFormationSlice } from '../../../../_redux/features/elaborations/tacheThemeFormationSlice';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile } from '../../../../services/elaborations/formationAPI';



function FormUploadFile({ tache }: { tache: TacheThemeFormation | undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language);
    const { t } = useTranslation();
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openUploadDoc);
    const [modalTitle, setModalTitle] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'uploading' | 'success' | 'error' | ''>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialisation du titre du modal au montage du composant
    useEffect(() => {
        setModalTitle(t('label.uploader_fichier'));
    }, [t]);

    const closeModal = () => {
        // Réinitialiser l'état local à la fermeture du modal
        setSelectedFile(null);
        setUploadStatus('');
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        dispatch(setShowModalUploadDoc());
    };

    // Gestion de la sélection de fichier
    const handleFileSelect = (file: File) => {
        if (file) {
            setSelectedFile(file);
            setUploadStatus('');
            setUploadProgress(0);
        }
    };

    // Gestion du drag & drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Simulation d'upload
    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsLoading(true)
        setUploadStatus('uploading');
        setUploadProgress(0);

        // Simulation d'un upload avec progression
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(uploadInterval);
            }
            setUploadProgress(progress);
        }, 200);

        try {
            const response = await uploadFile(selectedFile, lang)
            
            if (response.success){
                
                handleCompleteTask();
             }
        } catch (error) {
            clearInterval(uploadInterval);
            setUploadStatus('error');
            console.error('Erreur d\'upload:', error);
        }finally{
            setIsLoading(false)
        }
    };

    const handleCompleteTask = async () => {
        if (!tache || !currentUser._id) return;
       
        try {
            const response = await executerTacheTheme({
                tacheId: tache.tache._id||"",
                themeId: tache.theme?._id||"",
                statut: "EN_ATTENTE", // Marquer comme terminée après l'upload
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
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <CustomDialogModal
            title={modalTitle}
            isModalOpen={isModalOpen}
            isDelete={false}
            isLoading={isLoading}
            closeModal={closeModal}
            handleConfirm={handleUpload}
        >
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                    isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : selectedFile
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {!selectedFile ? (
                    <div className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                            Glissez votre fichier ici ou cliquez pour sélectionner
                        </p>
                        <p className="text-sm text-gray-500">
                            Formats supportés: PDF, DOC, DOCX, JPG, PNG (max 10MB)
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2">
                            <File className="h-8 w-8 text-blue-600" />
                            <div className="text-left">
                                <p className="font-medium text-gray-800 truncate max-w-48">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFile(null);
                                    setUploadStatus('');
                                    setUploadProgress(0);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <X className="h-4 w-4 text-red-500" />
                            </button>
                        </div>
                        {uploadStatus === 'uploading' && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                        {uploadStatus === 'success' && (
                            <div className="flex items-center justify-center space-x-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Upload réussi!</span>
                            </div>
                        )}
                        {uploadStatus === 'error' && (
                            <div className="flex items-center justify-center space-x-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Erreur d'upload</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
               
        </CustomDialogModal>
    );
}

export default FormUploadFile;