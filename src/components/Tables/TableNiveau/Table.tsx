import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";

interface TableNiveauProps {
    data: NiveauProps[];
    onCreate: () => void;
    onEdit: (niveau: NiveauProps) => void;
}


const Table = ({ data, onCreate, onEdit }: TableNiveauProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const cycles: CycleProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.cycles) ?? [];
    const sections = useSelector((state: RootState) => state.dataSetting.dataSetting.sections) ?? [];
    const [section, setSection] = useState<SectionProps>();
    const [cycle, setCycle] = useState<CycleProps>();

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    // fournira les donnees a la page
    const [filteredNiveau, setFilteredNiveau] = useState<NiveauProps[]>([]);
    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };


    // valeur de la l'id de la section selectionner
    const [selectSectionId, setSelectIdSection] = useState<string | undefined>('');

    // recuperer l'id de la section suite au click sur l'input select

    const handleSectionSelect = (selected: SectionProps | undefined) => {
        if (selected?._id) {
            setSelectIdSection(selected._id);
            filterCycleBySection(selected._id);
            setSection(selected);
        }
    };    


    // valeur de la l'id du cycle selectionner
    const [selectCycleId, setSelectIdCycle] = useState<string | undefined>('');
    const handleCycleSelect = (selected: CycleProps | undefined) => {
        if (selected?._id) {
            setSelectIdCycle(selected._id);
            filterNiveauxByCycle(selected._id);
            setCycle(selected);
        }
    };

    
    // Filtrer les niveaux en fonction de la langue
    const filterNiveauxByContenet = (niveaux: NiveauProps[]) => {
        if (searchText === '' && filteredCycle && filteredCycle.length > 0) {
            const result: NiveauProps[] = data.filter(niveau => niveau.cycle === filteredCycle[0]?._id);
            return result;
        }

        return niveaux.filter(niveau => {
            const libelle = lang === 'fr' ? niveau.libelleFr : niveau.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return niveau.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // fournira les donnees a la page
    const [filteredCycle, setFilteredCycle] = useState<CycleProps[]>([]);

    // filtrer les donnee a partir de l'id de la section selectionner
    const filterCycleBySection = (sectionId: string | undefined) => {
        if (sectionId && sectionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CycleProps[] = cycles.filter(cycle => cycle.section === sectionId);
            if (result.length > 0) {
                setSelectIdCycle(result[0]._id);
                setCycle(cycles.find(cycle=>cycle._id ===result[0]._id))
            }else{
                setSelectIdCycle(undefined);
                setCycle(undefined);
            }
            setFilteredCycle(result);
          
        }
    };

    // filtrer les donnee a partir de l'id du cycle selectionner

    const filterNiveauxByCycle = (cycleId: string | undefined) => {
        
        if (cycleId && cycleId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: NiveauProps[] = data.filter(niveau => niveau.cycle === cycleId);
            setFilteredNiveau(result);
        }else{
            setFilteredNiveau([]);
        }
    };

    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    //fournir initialement les données à la page
    useEffect(() => {
        if(!selectSectionId){
            if (sections && sections.length > 0) {
                filterCycleBySection(sections[0]._id);
            }
        }else{
            setFilteredCycle([]);
            filterCycleBySection(selectSectionId);
        }
        
        
    }, [sections, selectSectionId]);

    useEffect(() => {
        if (filteredCycle && filteredCycle.length > 0) {
            if(!selectCycleId){
                filterNiveauxByCycle(filteredCycle[0]?._id);
            }else{
                filterNiveauxByCycle(selectCycleId);
            }
                
        } else{
            setFilteredNiveau([]);
        }       
    }, [filteredCycle, data]);



    // modifier les donner de la page lors de la recherche
    useEffect(() => {
        const result = filterNiveauxByContenet(data);
        setFilteredNiveau(result);
    }, [searchText]);
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvelle_niveau')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.niveau')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.niveau')} </h1>
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={filteredCycle[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            {/* <CustomDropDown title="Région" items={sections} defaultValue={sections[0]} displayProperty={(section: Section) => `${section.libelle}`} onSelect={handleSectionSelect} />
                            <CustomDropDown title="Département" items={cycles} defaultValue={cycles[0]} displayProperty={(cycle: Cycle) => `${cycle.libelle}`} onSelect={handleCycleSelect} /> */}
                            {/* <CustomDropDown title="Niveau" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleNiveauxelect} /> */}
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<SectionProps>
                                title={t('label.section')}
                                selectedItem={section}
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: SectionProps) => `${lang === 'fr' ? section.libelleFr : section.libelleEn}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<CycleProps>
                                title={t('label.cycle')}
                                selectedItem={cycle}
                                items={filteredCycle}
                                defaultValue={filteredCycle[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: CommonSettingProps) => `${lang === 'fr' ? cycle.libelleFr : cycle.libelleEn}`}
                                onSelect={handleCycleSelect}
                            />
                            {/* <CustomDropDown title="Région" items={sections} defaultValue={sections[0]} displayProperty={(section: Section) => `${section.libelle}`} onSelect={handleSectionSelect} />
                            <CustomDropDown title="Département" items={cycles} defaultValue={cycles[0]} displayProperty={(cycle: Cycle) => `${cycle.libelle}`} onSelect={handleCycleSelect} /> */}
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />


                        {/* corp du tableau*/}
                        <BodyTable data={filteredNiveau} onEdit={onEdit} />





                    </table>
                </div>

                {/* Pagination */}

                {/* <h1>Pagination ici</h1> */}

            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;