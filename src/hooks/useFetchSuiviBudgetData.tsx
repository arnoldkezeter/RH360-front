import { useEffect, useState } from 'react';
import { getFilteredDepenses } from '../services/executions/depenseAPI';
import { getHistogrammeDepense, getTotauxBudget } from '../services/elaborations/budgetFormationAPI';
import { useDispatch } from 'react-redux';
import { deleteDepenseSlice, setDepenses } from '../_redux/features/execution/depenseSlice';


interface UseFetchDepensesReturnType {
  isLoading: boolean;
  depenses: DepenseReturnGetType | null;
  histogramme: any[] | null;
  totaux: {
    totalBudgetPrevu: number;
    totalBudgetReel: number;
    totalEcart: number;
  } | null;
  error: string | null;
  addDepense: (depense: Depense) => Promise<void>;
  updateDepense: (depense: Depense) => Promise<void>;
  deleteDepense: (depenseId: string) => Promise<void>;
}

export const useFetchDepensesData = ({
  page,
  lang,
  budgetId,
  type,
  search,
  formationId,
  themeId,
}: {
  page: number;
  lang: string;
  budgetId?: string;
  type?: string;
  search?: string;
  formationId?: string;
  themeId?: string;
}): UseFetchDepensesReturnType => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [depenses, setUseDepenses] = useState<DepenseReturnGetType | null>(null);
  const [histogramme, setHistogramme] = useState<any[] | null>(null);
  const [totaux, setTotaux] = useState<{
    totalBudgetPrevu: number;
    totalBudgetReel: number;
    totalEcart: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [depensesData, histogrammeData, totauxData] = await Promise.all([
        getFilteredDepenses({ page, lang, budgetId, type, search }),
        getHistogrammeDepense({ formationId, themeId }),
        getTotauxBudget({ formationId, themeId }),
      ]);

      if (depensesData) {
        dispatch(setDepenses(depensesData));
      } else {
        dispatch(setDepenses({
          depenses: [],
          currentPage: 0,
          totalItems: 0,
          totalPages: 0,
          pageSize: 0,
        }));
      }
      setUseDepenses(depensesData);
      setHistogramme(histogrammeData);
      setTotaux(totauxData);
    } catch (err: any) {
      console.error('Erreur lors du chargement des données :', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!formationId || !themeId) {
      return
    };
    fetchData();
  }, [page, lang, budgetId, type, search, formationId, themeId]);

  const refresh = async () => {
    await fetchData();
  };

  const addDepense = async (depense: Depense) => {
    // Mise à jour locale
    if (depenses) {
      const updated = {
        ...depenses,
        depenses: [depense, ...depenses.depenses],
        totalItems: depenses.totalItems + 1,
      };
      setUseDepenses(updated);
      dispatch(setDepenses(updated));
    }

    // Recharger histogramme + totaux
    await fetchData();
  };

  const updateDepense = async (depense: Depense) => {
    if (depenses) {
      const updated = {
        ...depenses,
        depenses: depenses.depenses.map((d) =>
          d._id === depense._id ? depense : d
        ),
      };
      setUseDepenses(updated);
      dispatch(setDepenses(updated));
    }

    await fetchData();
  };

  const deleteDepense = async (depenseId: string) => {
    if (depenses) {
      const updated = {
        ...depenses,
        depenses: depenses.depenses.filter((d) => d._id !== depenseId),
        totalItems: depenses.totalItems - 1,
      };
      setUseDepenses(updated);
      dispatch(deleteDepenseSlice({ id: depenseId }));
      
    }

    await fetchData();
  };

  return {
    isLoading,
    depenses,
    histogramme,
    totaux,
    error,
    addDepense,
    updateDepense,
    deleteDepense,
  };
};
