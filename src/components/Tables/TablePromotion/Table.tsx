import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { setShowModal } from "../../../_redux/features/setting";
import { RootState } from "../../../_redux/store";
import { extractYear } from '../../../fonctions/fonction';

interface TablePromotionProps {
    data: PromotionProps[];
    onCreate: () => void;
    onEdit: (promotion: PromotionProps) => void;
}

const Table = ({ data, onCreate, onEdit }: TablePromotionProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentYear = useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023;
    const firstYear = useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023;
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [filteredPromotion, setFilteredPromotion] = useState<PromotionProps[]>([]);

    // Filtrer les régions en fonction de la langue
    const filterPromotions = (promotions: PromotionProps[]) => {
        return promotions.filter(promotion => {
            const libelle = lang === 'fr' ? promotion.libelleFr : promotion.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return promotion.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    // Régions filtrées en fonction du texte de recherche
    const filteredPromotions = filterPromotions(data);
    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        if (selected) {
            setSelectedYear(extractYear(selected.toString()));
        }

    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvelle_promotion')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />

                <InputSearch hintText={t('recherche.rechercher') + t('recherche.promotion')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}

            {/* Afficher le tableau */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {/* <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.promotion')}</h1>
                {/* version mobile */}
                {/*<div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />
                        </div>
                    )}
                </div>

                {/* version desktop */}
                {/*<div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<String>
                                title={t('label.annee')}
                                selectedItem={formatYear(selectedYear)}
                                items={generateYearRange(currentYear, firstYear)}
                                defaultValue={formatYear(currentYear)} // ou spécifie une valeur par défaut

                                onSelect={handleAnneeSelect}
                            />
                        </div>
                    </div>
                </div>
                 */}
                
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />

                        {/* corp du tableau*/}
                        <BodyTable data={filteredPromotions} onEdit={onEdit} />

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
