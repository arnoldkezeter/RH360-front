import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from './toastify';

interface FetchDataOptions<TParams> {
  apiFunction: (params: TParams) => Promise<any>; // La fonction API générique
  params: TParams; // Les paramètres à passer à la fonction API
  onSuccess: (data: any) => void; // Fonction de succès
  onError?: (error: any) => void; // Fonction d'erreur (facultatif)
  onLoading?: (isLoading: boolean) => void; // Fonction pour gérer le chargement (facultatif)
}

export const useFetchData = () => {
  const { t } = useTranslation();

  const fetchData = useCallback(
    async <TParams extends Record<string, any>>({
      apiFunction,
      params,
      onSuccess,
      onError,
      onLoading,
    }: FetchDataOptions<TParams>) => {
      // Début du chargement
      onLoading?.(true);

      try {
        const data = await apiFunction(params);
        if (data) {
          onSuccess(data);
        } else {
          onSuccess([]); // En cas de réponse vide
        }
      } catch (error) {
        onError?.(error); // Appel de la fonction d'erreur si définie
        createToast(t('message.erreur'), '', 2);
      } finally {
        // Fin du chargement
        onLoading?.(false);
      }
    },
    [t]
  );

  return fetchData;
};
