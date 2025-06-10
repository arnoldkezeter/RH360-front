import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { setShowModal } from "../../../_redux/features/setting";
import { RootState } from "../../../_redux/store";

interface TableDepartementAcademiqueProps {
    data: CommonSettingProps[];
    onCreate: () => void;
    onEdit: (departementAcademique: CommonSettingProps) => void;
}

const Table = ({ data, onCreate, onEdit }: TableDepartementAcademiqueProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    // Filtrer les departementAcademique en fonction de la langue
    const filterDepartementAcademiques = (departementAcademiques: CommonSettingProps[]) => {
        if (departementAcademiques) {
            return departementAcademiques.filter(departementAcademique => {
                const libelle = lang === 'fr' ? departementAcademique.libelleFr : departementAcademique.libelleEn;
                // Vérifie si le code ou le libellé contient le texte de recherche
                return departementAcademique.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
            });
        } else {
            return [];
        }
    };

    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    // Régions filtrées en fonction du texte de recherche
    const filteredDepartementAcademiques = filterDepartementAcademiques(data);

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvelle_departementAcademique')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />

                <InputSearch hintText={t('recherche.rechercher') + t('recherche.departementAcademique')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}

            {/* Afficher le tableau */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />


                        {/* corp du tableau*/}
                        <BodyTable data={filteredDepartementAcademiques} onEdit={onEdit} />

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
