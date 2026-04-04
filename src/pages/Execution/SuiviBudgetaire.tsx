import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useHeader } from "../../components/Context/HeaderConfig";
import BreadcrumbPageDescription from "../../components/BreadcrumbPageDescription";

import { setShowModal, setShowModalGenerateDoc } from "../../_redux/features/setting";

import { useFetchDepensesData } from "../../hooks/useFetchSuiviBudgetData";
import FormDelete from "../../components/Modals/Execution/ModalBudgetDepense/FormDelete";
import FormCreateUpdate from "../../components/Modals/Execution/ModalBudgetDepense/FormCreateUpdate";
import { useFetchData } from "../../hooks/fechDataOptions";
import { getFormationForDropDown } from "../../services/elaborations/formationAPI";
import { setErrorPageFormation, setFormations } from "../../_redux/features/elaborations/formationSlice";
import { TYPE_DEPENSE } from "../../config";
import Table from "../../components/Tables/Execution/TableBudgetFormation/Table";
import { getThemeById, getThemeFormationForDropDown } from "../../services/elaborations/themeFormationAPI";
import { setErrorPageThemeFormation, setThemeFormations } from "../../_redux/features/elaborations/themeFormationSlice";
import FormCreateUpdateNoteBudget from "../../components/Modals/Notes/ModalNoteService/FormCreateUpdateNoteBudget";

const SuiviBudgetaires = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const fetchData = useFetchData();
  const lang = useSelector((state: RootState) => state.setting.language);
  const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
  const { data: { programmeFormations } } = useSelector((state: RootState) => state.programmeFormationSlice);
  const { data: { formations } } = useSelector((state: RootState) => state.formationSlice);
  const { data: { themeFormations } } = useSelector((state: RootState) => state.themeFormationSlice);

  const typesDepenses = Object.values(TYPE_DEPENSE);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDepense, setSelectedDepense] = useState<Depense | null>(null);
  const [currentProgrammeFormation, setCurrentProgrammeFormation] = useState<ProgrammeFormation | undefined>(undefined);
  const [currentFormation, setCurrentFormation] = useState<Formation | undefined>(undefined);
  const [currentTheme, setCurrentTheme] = useState<ThemeFormation | undefined>(undefined);
  const [currentType, setCurrentType] = useState<TypeDepense>();

  // ─── REFS ──────────────────────────────────────────────────────────────────
  // urlInitDone : true après que l'init URL soit entièrement terminée.
  // Tant qu'il est false, les effets en cascade ne doivent pas écraser les valeurs.
  const urlInitDone = useRef(false);
  const urlInitInProgress = useRef(false);


  // Ces refs stockent les IDs à sélectionner APRÈS les fetchs en cascade,
  // sans déclencher de re-renders supplémentaires.
  const pendingFormationId = useRef<string | undefined>(undefined);
  const pendingThemeId = useRef<string | undefined>(undefined);

  // ─── HEADER ────────────────────────────────────────────────────────────────
  const { setHeaderConfig } = useHeader();

  const handleAdd = useCallback(() => {
    setSelectedDepense(null);
    dispatch(setShowModal());
  }, [dispatch]);

  const handleExport = useCallback(() => {
    dispatch(setShowModalGenerateDoc());
  }, [dispatch]);

  useEffect(() => {
    setHeaderConfig({
      title: t('button.ajouter_depense_formation'),
      showAddButton: false,
      exportOptions: ['PDF'],
      onAdd: handleAdd,
      onExport: handleExport,
    });
  }, [t, dispatch, setHeaderConfig, handleAdd, handleExport]);

  // ─── INIT PAR DÉFAUT (sans URL) ────────────────────────────────────────────
  // Ne s'exécute que si aucune init URL n'est en cours et qu'aucun programme
  // n'est encore sélectionné.
  useEffect(() => {
    // ✅ Ne pas écraser si une init URL est en cours
    if (urlInitInProgress.current) return;
    if (!urlInitDone.current && programmeFormations.length > 0 && !currentProgrammeFormation) {
      setCurrentProgrammeFormation(prev =>
        prev?._id === programmeFormations[0]._id ? prev : programmeFormations[0]
      );
    }
  }, [programmeFormations, currentProgrammeFormation]);

  // ─── FETCH DÉPENSES ────────────────────────────────────────────────────────
  const {
    isLoading,
    depenses,
    histogramme,
    totaux,
    addDepense,
    updateDepense,
    deleteDepense
  } = useFetchDepensesData({
    page: currentPage,
    lang,
    themeId: currentTheme?._id,
    type: currentType?.key
  });

  // ─── INIT DEPUIS L'URL ─────────────────────────────────────────────────────
  // Exécuté une seule fois au montage (ou si lang change).
  // On extrait programme / formation / thème depuis l'objet retourné par getThemeById,
  // on stocke les IDs cibles dans les refs AVANT de déclencher la cascade de fetchs,
  // puis on lance uniquement setCurrentProgrammeFormation → les deux effets suivants
  // s'occupent du reste en lisant les refs.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const themeIdFromUrl = urlParams.get('theme');

    if (!themeIdFromUrl) return;

    // ✅ Signale qu'une init URL est en cours AVANT tout fetch
    urlInitInProgress.current = true;

    const loadThemeFromUrl = async () => {
      try {
        const theme = await getThemeById({ themeId: themeIdFromUrl, lang });
        if (!theme) {
          urlInitInProgress.current = false;
          return;
        }

        const formation = theme.formation as Formation;
        const programme = formation?.programmeFormation as ProgrammeFormation;

        if (!programme || !formation) {
          urlInitInProgress.current = false;
          return;
        }

        pendingFormationId.current = formation._id;
        pendingThemeId.current = theme._id;

        setCurrentProgrammeFormation(prev => prev?._id === programme._id ? prev : programme);
        setCurrentFormation(prev => prev?._id === formation._id ? prev : formation);
        setCurrentTheme(prev => prev?._id === theme._id ? prev : theme);

      } catch (err) {
        console.error("Erreur chargement thème depuis URL :", err);
        urlInitInProgress.current = false;
        if (programmeFormations.length > 0) {
          setCurrentProgrammeFormation(programmeFormations[0]);
        }
      }
    };

    loadThemeFromUrl();
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── FETCH FORMATIONS ──────────────────────────────────────────────────────
  // Se déclenche à chaque changement de programme (init URL ou navigation manuelle).
  // Si pendingFormationId est défini (init URL), on sélectionne cette formation précise.
  // Sinon on prend la première de la liste (comportement normal).
  useEffect(() => {
    if (!currentProgrammeFormation?._id) return;
    if (urlInitInProgress.current) return;

    fetchData({
      apiFunction: getFormationForDropDown,
      params: {
        lang,
        programmeId: currentProgrammeFormation._id,
        userId: currentUser._id
      },
      onSuccess: (data) => {
        dispatch(setFormations(data));
      
        if (!data.formations?.length) {
          setCurrentFormation(undefined);
          pendingFormationId.current = undefined;
          return;
        }
      
        const targetId = pendingFormationId.current;
        pendingFormationId.current = undefined;
      
        const toSelect = targetId
          ? data.formations.find((f: Formation) => f._id === targetId) ?? data.formations[0]
          : data.formations[0];
      
        // ✅ Ne mettre à jour que si l'ID change réellement
        setCurrentFormation(prev =>
          prev?._id === toSelect._id ? prev : toSelect
        );
      },
      onError: () => dispatch(setErrorPageFormation(t('message.erreur')))
    });
  }, [currentProgrammeFormation?._id, lang, currentUser._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── FETCH THÈMES ──────────────────────────────────────────────────────────
  // Même logique : si pendingThemeId est défini (init URL), on sélectionne ce thème.
  // Sinon on prend le premier de la liste.
  // Une fois pendingThemeId consommé, urlInitDone passe à true : désormais les
  // changements manuels fonctionnent normalement.
  useEffect(() => {
    if (!currentFormation?._id) return;
    if (urlInitInProgress.current) return;

    fetchData({
      apiFunction: getThemeFormationForDropDown,
      params: {
        lang,
        formation: currentFormation._id,
        userId: currentUser._id
      },
      onSuccess: (data) => {
        dispatch(setThemeFormations(data));

        if (!data.themeFormations?.length) {
          setCurrentTheme(undefined);
          pendingThemeId.current = undefined;
          urlInitDone.current = true;
          return;
        }

        const targetId = pendingThemeId.current;
        pendingThemeId.current = undefined;
        urlInitDone.current = true;
        urlInitInProgress.current = false; 

        const toSelect = targetId
          ? data.themeFormations.find((th: ThemeFormation) => th._id === targetId) ?? data.themeFormations[0]
          : data.themeFormations[0];

        // ✅ Ne mettre à jour que si l'ID change réellement
        setCurrentTheme(prev =>
          prev?._id === toSelect._id ? prev : toSelect
        );
      },
      onError: () => {
        dispatch(setErrorPageThemeFormation(t('message.erreur')));
        urlInitDone.current = true;
        urlInitInProgress.current = false; 
      }
    });
  }, [currentFormation?._id, lang, currentUser._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── HANDLERS ──────────────────────────────────────────────────────────────
  // Quand l'utilisateur change manuellement le programme, on efface les refs
  // (plus d'init URL en attente) et on reset la cascade.
  const handleProgrammeFormationChange = (programme: ProgrammeFormation) => {
    urlInitInProgress.current = false;
    pendingFormationId.current = undefined;
    pendingThemeId.current = undefined;
    setCurrentProgrammeFormation(prev => prev?._id === programme._id ? prev : programme); // ✅ ici
    setCurrentFormation(undefined);
    setCurrentTheme(undefined);
  };

  const handleFormationChange = (formation: Formation) => {
    urlInitInProgress.current = false;
    pendingThemeId.current = undefined;
    setCurrentFormation(formation);
    setCurrentTheme(undefined);
  };

  const handleThemeFormationChange = (theme: ThemeFormation) => {
    urlInitInProgress.current = false;
    setCurrentTheme(theme);
  };

  const handleTypeChange = (type: TypeDepense) => {
    setCurrentType(type);
  };

  return (
    <>
      <BreadcrumbPageDescription
        pageDescription={t('page_description.suivi_budgetaire')}
        titleColor="text-[#1e3a8a]"
        pageName={t('sub_menu.suivi_budgetaire')}
      />

      <Table
        typesDepenses={typesDepenses}
        programmeFormations={programmeFormations}
        formations={formations}
        themes={themeFormations}
        currentFormation={currentFormation}
        currentTheme={currentTheme}
        currentProgrammeFormation={currentProgrammeFormation}
        currentType={currentType}
        data={depenses?.depenses || []}
        histogramme={histogramme || []}
        totaux={totaux || 0}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onFormationChange={handleFormationChange}
        onThemeChange={handleThemeFormationChange}
        onProgrammeFormationChange={handleProgrammeFormationChange}
        onTypeChange={handleTypeChange}
        onCreate={() => setSelectedDepense(null)}
        onEdit={setSelectedDepense}
        isLoading={isLoading}
      />

      <FormCreateUpdate
        depense={selectedDepense}
        themeId={currentTheme?._id!}
        onAdd={addDepense}
        onUpdate={updateDepense}
      />

      <FormDelete
        depense={selectedDepense}
        onDelete={deleteDepense}
      />

      <FormCreateUpdateNoteBudget
        note={undefined}
        themeId={currentTheme?._id!}
      />
    </>
  );
};

export default SuiviBudgetaires;