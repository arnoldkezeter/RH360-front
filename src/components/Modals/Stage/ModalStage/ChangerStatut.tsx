import React, { useState } from "react";
import { changerStatutStageService } from "../../../../services/stagiaires/stageAPI";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../_redux/store";
import CustomDialogModal from "../../CustomDialogModal";
import { setShowModal } from "../../../../_redux/features/setting";
import createToast from "../../../../hooks/toastify";
import { updateStageSlice } from "../../../../_redux/features/stagiaire/stageSlice";

const ChangerStatutStage = ({ stage }:{stage:Stage|undefined}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const closeModal = () => { dispatch(setShowModal()); };
    const [statut, setStatut] = useState("REFUSE");
    const [file, setFile] = useState<File|null>(null);
    const lang = useSelector((state: RootState) => state.setting.language);
    console.log(stage)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
           await changerStatutStageService({stageId:stage?._id||"", statut:statut, noteServiceFile:file, lang:lang}).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (stage && stage._id) {
                        dispatch(updateStageSlice({
                            id: stage._id||"",
                            stageData: {
                                ...stage,
                                statut:statut,
                                _id:stage._id,
                            }
                        }));
                    }

                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            }).finally(()=>{
                setIsLoading(false);
            });
        } catch (err) {
            console.error(err);
        }finally{
            setIsLoading(false)
        }
    };

  return (
    <CustomDialogModal
        title={t('form_update.enregistrer')}
        isModalOpen={isModalOpen}
        isDelete={false}
        closeModal={closeModal}
        handleConfirm={handleSubmit}
        isLoading={isLoading}
    >
        <label>{t('label.statut')}</label><label className="text-red-500"> *</label>
        <select value={statut} 
            className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            onChange={(e) => setStatut(e.target.value)}
        >
            <option value=""></option>
            <option value="ACCEPTE">{(t('label.accepter'))}</option>
            <option value="REFUSE">{t('label.refuser')}</option>
        </select>

        {statut === "ACCEPTE" && (
            <>
                <label>{t('label.note_service')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="file"
                    onChange={handleFileChange}
                />
            </>
        )}

    </CustomDialogModal>
  );
};

export default ChangerStatutStage;
