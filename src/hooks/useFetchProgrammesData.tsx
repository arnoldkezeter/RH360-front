import { useState, useEffect } from 'react';
import { getNombreProgrammesActifs, getPourcentageExecutionProgrammes, getProgrammeFormations, getRepartitionFormationsParProgramme } from '../services/elaborations/programmeFormationAPI';
import { useDispatch } from 'react-redux';
import { deleteProgrammeFormationSlice, setProgrammeFormations } from '../_redux/features/elaborations/programmeFormationSlice';


interface UseFetchProgrammesDataReturnType {
  isLoading: boolean;
  programmes: ProgrammeFormationReturnGetType | null;
  repartitionFormations: any[] | null;
  totalProgrammesActifs: number | null;
  pourcentageExecution: number | null;
  error: string | null;
}

export const useFetchProgrammesData = (page: number, lang: string): UseFetchProgrammesDataReturnType & { 
  addProgramme: (programme: ProgrammeFormation) => void,
  updateProgramme: (programme: ProgrammeFormation) => void 
  deleteProgramme: (programmeId: string) => void 
} => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [programmes, setProgrammes] = useState<ProgrammeFormationReturnGetType | null>(null);
  const [repartitionFormations, setRepartitionFormations] = useState<RepartitionProgramme[] | null>(null);
  const [totalProgrammesActifs, setTotalProgrammesActifs] = useState<number | null>(null);
  const [pourcentageExecution, setPourcentageExecution] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [programmesData, repartitionData, totalActifs, executionPourcentage] = await Promise.all([
          getProgrammeFormations({ page, lang }),
          getRepartitionFormationsParProgramme(),
          getNombreProgrammesActifs(),
          getPourcentageExecutionProgrammes(),
        ]);

        if (programmesData) {
          dispatch(setProgrammeFormations(programmesData));
        } else {
          dispatch(setProgrammeFormations({
            programmeFormations: [],
            currentPage: 0,
            totalItems: 0,
            totalPages: 0,
            pageSize: 0,
          }));
        }
        setProgrammes(programmesData);
        setRepartitionFormations(repartitionData);
        setTotalProgrammesActifs(totalActifs);
        setPourcentageExecution(executionPourcentage);
      } catch (err: any) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.message || 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, lang, dispatch]);

  // Fonction pour ajouter un programme localement
  const addProgramme = async (programme: ProgrammeFormation) => {
    try {
      // Ajouter le programme à programmes localement
      if (programmes) {
        const updatedProgrammes = {
          ...programmes,
          programmeFormations: [programme, ...programmes.programmeFormations],
          totalItems: programmes.totalItems + 1,
        };
        setProgrammes(updatedProgrammes);
        dispatch(setProgrammeFormations(updatedProgrammes));
      }

      // Ajouter le programme à repartitionData
      if (repartitionFormations) {
        const updatedRepartition = [
          ...repartitionFormations,
          {
            programmeId: programme._id as string, // Assurez-vous que _id est une chaîne
            annee: programme.annee,
            nombreFormationPrevue: 0,
            nombreFormationExecutee: 0,
          },
        ];
        setRepartitionFormations(updatedRepartition);
      }

      // Rappeler les fonctions API pour garder les données synchronisées
      await fetchProgrammesData();
    } catch (err) {
      console.error("Erreur lors de l'ajout d'un programme :", err);
    }
  };

  // Fonction pour mettre à jour un programme localement
  const updateProgramme = async (programme: ProgrammeFormation) => {
    try {
      // Mettre à jour programmes localement
      if (programmes) {
        const updatedProgrammes = {
          ...programmes,
          programmeFormations: programmes.programmeFormations.map((p) =>
            p._id === programme._id ? programme : p
          ),
        };
        setProgrammes(updatedProgrammes);
        dispatch(setProgrammeFormations(updatedProgrammes));
      }

      // Mettre à jour repartitionData
      if (repartitionFormations) {
        const updatedRepartition = repartitionFormations.map((r) =>
          r.programmeId === programme._id
            ? { ...r, annee: programme.annee }
            : r
        );
        setRepartitionFormations(updatedRepartition);
      }

      // Rappeler les fonctions API pour garder les données synchronisées
      await fetchProgrammesData();
    } catch (err) {
      console.error("Erreur lors de la mise à jour d'un programme :", err);
    }
  };

  // Fonction pour supprimer un programme localement
  const deleteProgramme = async (programmeId: string) => {
    try {
      // Mettre à jour programmes localement
      setProgrammes((prev) => {
        if (!prev) return null;
        const updatedProgrammes = {
          ...prev,
          programmeFormations: prev.programmeFormations.filter(
            (p) => p._id !== programmeId
          ),
          totalItems: prev.totalItems - 1,
        };
        dispatch(deleteProgrammeFormationSlice({ id: programmeId }));
        return updatedProgrammes;
      });

      // Supprimer le programme de repartitionData
      if (repartitionFormations) {
        const updatedRepartition = repartitionFormations.filter(
          (r) => r.programmeId !== programmeId
        );
        setRepartitionFormations(updatedRepartition);
      }

      // Rappeler les fonctions API pour garder les données synchronisées
      await fetchProgrammesData();
    } catch (err) {
      console.error("Erreur lors de la suppression d'un programme :", err);
    }
  };

  // Fonction utilitaire pour rappeler les données via les API
  const fetchProgrammesData = async () => {
    try {
      const [programmesData, repartitionData, totalActifs, executionPourcentage] =
        await Promise.all([
          getProgrammeFormations({ page, lang }),
          getRepartitionFormationsParProgramme(),
          getNombreProgrammesActifs(),
          getPourcentageExecutionProgrammes(),
        ]);

      // Mise à jour des états
      setProgrammes(programmesData);
      setRepartitionFormations(repartitionData);
      setTotalProgrammesActifs(totalActifs);
      setPourcentageExecution(executionPourcentage);
    } catch (err) {
      console.error("Erreur lors du rappel des données :", err);
    }
  }


    return {
      isLoading,
      programmes,
      repartitionFormations,
      totalProgrammesActifs,
      pourcentageExecution,
      error,
      addProgramme,
      updateProgramme,
      deleteProgramme,
    };
};


