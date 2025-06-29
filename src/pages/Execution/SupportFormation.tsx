import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal } from "../../_redux/features/setting";

import { useFetchData } from "../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../services/elaborations/formationAPI";
import { setErrorPageFormation, setFormations } from "../../_redux/features/elaborations/formationSlice";
import { setErrorPageThemeFormation, setThemeFormationLoading, setThemeFormations } from "../../_redux/features/elaborations/themeFormationSlice";
import { getBudgetFormationForDropDown } from "../../services/elaborations/budgetFormationAPI";
import { setBudgetFormationLoading, setBudgetFormations, setBudgetFormationSelected, setErrorPageBudgetFormation } from "../../_redux/features/elaborations/budgetFormationSlice";
import Table from "../../components/Tables/Execution/TableBudgetFormation/Table";
import { getFilteredSupportsFormation } from "../../services/executions/supportFormationAPI";
import { setErrorPageSupportFormation, setSupportFormationLoading, setSupportFormations } from "../../_redux/features/execution/supportFormationSlice";
import { getThemeFormationForDropDown } from "../../services/elaborations/themeFormationAPI";
import SupportFormationBody from "../../components/Tables/Execution/SupportFormations/SupportFormationBody";
import FormCreateUpdate from "../../components/Modals/Execution/SupportFormation/FormCreateUpdate";

const mockSupports = [
  {
    _id: "1",
    nomFr: "Introduction à la gestion de projet Support d'introduction à la gestion de projet avec les meilleures pratiques et méthodologies",
    nomEn: "Introduction to Project Management",
    descriptionFr: "Support d'introduction à la gestion de projet avec les meilleures pratiques et méthodologies.",
    descriptionEn: "Introductory material on project management with best practices and methodologies.",
    fichier: "uploads/supports/gestion_projet_intro.pdf",
    theme: {
        _id: "101",
        titreFr: "Support d'introduction à la gestion de projet avec les meilleures pratiques et méthodologies ",
        titreEn: "Project Management",
        dateDebut: '2024-01-15',
        dateFin: '2024-06-30',
    }
  },
  {
    _id: "2",
    nomFr: "Sécurité informatique avancée",
    nomEn: "Advanced Cybersecurity",
    descriptionFr: "Support complet pour le module de sécurité informatique couvrant les dernières menaces et protections.",
    descriptionEn: "Comprehensive material for the cybersecurity module covering latest threats and protections.",
    fichier: "uploads/supports/securite_info.docx",
    theme: {
        _id: "102",
        titreFr: "Sécurité Informatique Sécurité Informatique Sécurité Informatique Sécurité Informatique",
        titreEn: "IT Security",
        dateDebut: '2024-02-01',
        dateFin: '2024-07-15',
        formation: undefined
    }
  },
  {
    _id: "3",
    nomFr: "Communication efficace",
    nomEn: "Effective Communication",
    descriptionFr: "Techniques avancées pour améliorer la communication interpersonnelle et professionnelle.",
    descriptionEn: "Advanced techniques to improve interpersonal and professional communication.",
    fichier: "uploads/supports/communication.pptx",
    theme: {
        _id: "103",
        titreFr: "Développement Personnel",
        titreEn: "Personal Development",
        dateDebut: '2024-03-01',
        dateFin: '2024-08-30',
        formation: undefined
    }
  },
  {
    _id: "4",
    nomFr: "Analytics et Data Science",
    nomEn: "Analytics and Data Science",
    descriptionFr: "Formation complète sur l'analyse de données et les techniques de data science.",
    descriptionEn: "Complete training on data analysis and data science techniques.",
    fichier: "uploads/supports/data_science.xlsx",
    theme: {
        _id: "104",
        titreFr: "Data Science",
        titreEn: "Data Science",
        dateDebut: '2024-04-01',
        dateFin: '2024-09-15',
        formation: undefined
    }
  },
  {
    _id: "5",
    nomFr: "Développement Web Frontend",
    nomEn: "Frontend Web Development",
    descriptionFr: "Maîtrisez les technologies modernes de développement web frontend.",
    descriptionEn: "Master modern frontend web development technologies.",
    fichier: "uploads/supports/frontend_dev.mp4",
    theme: {
        _id: "105",
        titreFr: "Développement Web",
        titreEn: "Web Development",
        dateDebut: '2024-05-01',
        dateFin: '2024-10-30',
        formation: undefined
    }
  },
  {
    _id: "6",
    nomFr: "Leadership et Management",
    nomEn: "Leadership and Management",
    descriptionFr: "Développez vos compétences en leadership et management d'équipe.",
    descriptionEn: "Develop your leadership and team management skills.",
    fichier: "uploads/supports/leadership.zip",
    theme: {
        _id: "106",
        titreFr: "Leadership",
        titreEn: "Leadership",
        dateDebut: '2024-06-01',
        dateFin: '2024-11-15',
        formation: undefined
    }
  }
];

const SupportFormationManager = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchData = useFetchData();
  const lang = useSelector((state: RootState) => state.setting.language);
  const { data: { supportFormations } } = useSelector((state: RootState) => state.supportFormationSlice);
  const pageIsLoading  = useSelector((state: RootState) => state.supportFormationSlice.pageIsLoading);
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedSupport, setSelectedSupport] = useState<SupportFormation | null>(null);
  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation | undefined>(undefined);
  const [currentFormation, setCurrentFormation] = useState<Formation | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState<ThemeFormation | undefined>(undefined);
 


  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      title: t('button.ajouter_support'),
      showAddButton: true,
      exportOptions: [],
      onAdd: () => { setSelectedSupport(null); dispatch(setShowModal()) },
    });
  }, [t]);

    useEffect(() => {
        if (!currentProgrammeFormation && programmeFormations.length > 0) {
            setCurrentProgrammeFormation(programmeFormations[0]);
        }
    }, [programmeFormations, currentProgrammeFormation]);
  
  
  // Charge les formations pour un programmeFormation spécifique
  useEffect(() => {
          if (!currentProgrammeFormation || !currentProgrammeFormation._id) return;
  
          fetchData({
              apiFunction: getFormationForDropDown,
              params: { lang, programmeId: currentProgrammeFormation._id },
              onSuccess: (data) => {
                  dispatch(setFormations(data));
                  // Définir le premier formation comme formation courant
                  if (data && data.formations?.length > 0) {
                      setCurrentFormation(data.formations[0]);
                  } else {
                      setCurrentFormation(undefined);
                  }
                  
              },
               onError: () => {
                  dispatch(setErrorPageFormation(t('message.erreur')));
              },
          });
  }, [currentProgrammeFormation, lang, dispatch]);


  // Charge les themeFormations en fonction des filtres
  useEffect(() => {          
      // Cas où on ne filtre pas (pas de formation, pas de familleMetier, pas resetFilters)
      if (
          !currentFormation || formations.length === 0 
      ) return;


      fetchData({
          apiFunction: getThemeFormationForDropDown,
          params: {
              formation: currentFormation?._id || "",
              lang,
          },
          onSuccess: (data) => {
              // Définir le premier theme formation comme formation courant
              if (data && data.themeFormations?.length > 0) {
                  setCurrentTheme(data.themeFormations[0]);
              } else {
                  setCurrentTheme(undefined);
              }
             
              dispatch(setThemeFormations(data || {
                  themeFormations: [],
                  currentPage: 0,
                  totalItems: 0,
                  totalPages: 0,
                  pageSize: 0,
              }));
          },
          onError: () => {
              dispatch(setErrorPageThemeFormation(t('message.erreur')));
          },
          onLoading: (isLoading) => {
              dispatch(setThemeFormationLoading(isLoading));
          },
      });
  }, [currentFormation, lang, dispatch]);

  
  // Charge les supports en fonction des filtres
    useEffect(() => {
       
        if (currentTheme === undefined) {
            dispatch(setSupportFormations({
                supportFormations: [],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
            }));
            return;
        }

        fetchData({
            apiFunction: getFilteredSupportsFormation,
            params: {
                page: currentPage,
                themeId: currentTheme?._id,
                lang,
            },
            onSuccess: (data) => {
                
                dispatch(setSupportFormations(data || {
                    supportFormations: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
            },
            onError: () => {
                dispatch(setErrorPageSupportFormation(t('message.erreur')));
            },
            onLoading: (isLoading) => {
                dispatch(setSupportFormationLoading(isLoading));
            },
        });
    }, [currentPage, currentTheme, lang, dispatch]);
    
  const handleProgrammeFormationChange = (programmeFormation: ProgrammeFormation) => {
      setCurrentProgrammeFormation(programmeFormation);
  };

  const handleFormationChange = (formation: Formation) => {
      setCurrentFormation(formation);
  };

  const handleThemeChange = (theme: ThemeFormation) => {
      setCurrentTheme(theme);
  };

  return (
    <>
      <BreadcrumbPageDescription
        pageDescription={t('page_description.support_formation')}
        titleColor="text-[#1e3a8a]"
        pageName={t('sub_menu.support_formation')}
      />

      <SupportFormationBody
        programmeFormations={programmeFormations}
        formations={formations}
        themes={themeFormations}
        currentFormation={currentFormation}
        currentProgrammeFormation={currentProgrammeFormation}
        currentTheme={currentTheme}
        data={supportFormations}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onFormationChange={handleFormationChange}
        onProgrammeFormationChange={handleProgrammeFormationChange}
        onThemeChange={handleThemeChange}
        onEdit={setSelectedSupport}
        isLoading={pageIsLoading}
      />

      <FormCreateUpdate supportFormation={selectedSupport} theme={currentTheme}/>
      
    </>
  );
};



export default SupportFormationManager;
