import CustomDialogModal from "../CustomDialogModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { setShowModalCustom, setShowModalDeleteCustom } from "../../../_redux/features/setting";
import { useTranslation } from "react-i18next";


export function ModalNonAutoriser() {

    const { t } = useTranslation();
    const dispatch = useDispatch()

    const closeModal = () => {
        dispatch(setShowModalCustom(false));
        dispatch(setShowModalDeleteCustom(false));
    };
    const isCreateAndUpdate = useSelector((state: RootState) => state.setting.showModal.open);
    const isDelete = useSelector((state: RootState) => state.setting.showModal.delete);

    const isModalOpen = isCreateAndUpdate || isDelete;

    return (
        <>
            <CustomDialogModal
                title={t('message.non_autoriser')}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={closeModal}
                unique={true}
            >




                <p>
                    {t('message.vous_etes_pas_autoriser_a_mener_cette_action')}
                </p>



                {/* SERVICE */}

            </CustomDialogModal>
        </>
    );

}