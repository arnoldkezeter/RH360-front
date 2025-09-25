import { useDispatch, useSelector } from 'react-redux';
import { setShowModalDelete } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { deleteProgrammeFormationSlice } from '../../../../_redux/features/elaborations/programmeFormationSlice';
import { deleteProgrammeFormation } from '../../../../services/elaborations/programmeFormationAPI';
import { useState } from 'react';


function FormDelete({ programmeFormation, onDelete}: { programmeFormation: ProgrammeFormation | null, onDelete: (programmeId: string) => void;  }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.delete);
    const closeModal = () => { dispatch(setShowModalDelete()); };

    const lang = useSelector((state: RootState) => state.setting.language);


    const handleDelete = async () => {

        if (programmeFormation?._id != undefined) {
            setIsLoading(true)
            await deleteProgrammeFormation(programmeFormation._id, lang).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);

                    if (programmeFormation._id) {
                        onDelete(programmeFormation._id);
                        dispatch(deleteProgrammeFormationSlice({ id: programmeFormation._id }));
                    }

                    closeModal();
                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);

            }).finally(()=>{
                setIsLoading(false)
            })
        }

    }

    return (
        <>
            <CustomDialogModal
                title={t('form_delete.supprimer')}
                isModalOpen={isModalOpen}
                isDelete={true}
                closeModal={closeModal}
                handleConfirm={handleDelete}
                isLoading={isLoading}
            >
                <h1>{t('form_delete.suppression') + t('form_delete.programme_formation')} : {programmeFormation ? programmeFormation.annee : ""}</h1>
            </CustomDialogModal>
        </>
    );
}

export default FormDelete



