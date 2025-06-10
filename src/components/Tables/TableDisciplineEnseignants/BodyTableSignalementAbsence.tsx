import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../../Modals/CustomDialogModal';
import { formatDate } from '../../../fonctions/fonction';
import { jours } from '../../../pages/CommonPage/EmploiDeTemp';

const BodyTableSignalementAbsence = ({ data }: { data: SignalementAbsence[] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language);

    const handleOpenModal = (description: string) => {
        setSelectedDescription(description);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    // const formatDate = (dateStr: string) => {
    //     const dateCreation = new Date(dateStr);
    //     return `${dateCreation.getDate()}/${dateCreation.getMonth() + 1}/${dateCreation.getFullYear()} ${dateCreation.getHours()}h:${dateCreation.getMinutes()}m`;
    // };

    // const formatDate2 = (dateStr: string) => {
    //     const dateCreation = new Date(dateStr);
    //     return `${dateCreation.getDate()}/${dateCreation.getMonth() + 1}/${dateCreation.getFullYear()}`;
    // };

    return (
        <tbody>
            {data.map((item, index) => (
                <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                    <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                        {index + 1}
                    </td>

                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                        <h5>{formatDate(item.date_creation)}</h5>
                    </td>

                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <h5>{item.user.nom}</h5>
                    </td>

                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                        <h5>{item.user.prenom}</h5>
                    </td>

                    
                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                        {lang==='fr'?jours.find(jour=>jour.ordre==item.jour_absence)?.libelleFr??"":jours.find(jour=>jour.ordre==item.jour_absence)?.libelleEn??""}
                    </td>

                    <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                        {item.heure_debut_absence+"-"+item.heure_fin_absence}
                    </td>

                    {/* <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                        <button
                            className="bg-primary px-4 py-2 text-white hover:opacity-65 rounded-full"
                            onClick={() => handleOpenModal(item.description)}
                        >
                            {t('header_table.detail')}
                        </button>
                    </td> */}
                </tr>
            ))}
            {/* Modal */}
            <CustomDialogModal
                unique={true}
                title={t('header_table.detail')}
                isModalOpen={isModalOpen}
                closeModal={handleCloseModal}
                handleConfirm={handleCloseModal}
                isDelete={false}
            >
                <p>{selectedDescription}</p>
            </CustomDialogModal>
        </tbody>
    );
};

export default BodyTableSignalementAbsence;
