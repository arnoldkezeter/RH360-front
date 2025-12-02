import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/taches-theme-formation`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createTacheThemeFormation({tache, dateDebut, dateFin}: TacheThemeFormation,themeId:string,  lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {themeId, tacheId:tache._id, dateDebut, dateFin},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating tachethemeformation:', error);
        throw error;
    }
}

export async function updateTacheThemeFormation({ _id, tache, dateDebut, dateFin }: TacheThemeFormation,lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}/dates`,
            {tache:tache._id, dateDebut, dateFin},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating tachethemeformation:', error);
        throw error;
    }
}

export async function deleteTacheThemeFormation(tacheThemeFormationId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${tacheThemeFormationId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting tachethemeformation:', error);
        throw error;
    }
}

export async function getFilteredTacheThemeFormations({page, lang,themeId, dateDebut, dateFin, executee, niveau, search }: {page: number, lang:string,themeId?:string|null, executee?:boolean,niveau?:string, dateDebut?:string, dateFin?:string, search?:string }): Promise<TacheThemeFormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/theme/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    estExecutee:executee,
                    niveau:niveau,
                    dateDebut, 
                    dateFin, 
                    nom:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const tacheThemeFormations: TacheThemeFormationReturnGetType = response.data.data;
        console.log(tacheThemeFormations)
        return tacheThemeFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTacheProgressionByTheme({themeId, lang}:{themeId: string, lang: string}): Promise<ReponseApiPros> {
    try {
        const url = `${api}/theme/${themeId}/progression`;

        const response: AxiosResponse<any> = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'accept-language': lang,
                'authorization': token,
            },
        });

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Erreur lors de la récupération de la progression des tâches.");
        }

    } catch (error) {
        console.error('Erreur lors de la récupération de la progression des tâches:', error);
        
        // Gérer les erreurs spécifiques d'Axios
        if (axios.isAxiosError(error) && error.response) {
            // Renvoyer le message d'erreur du serveur
            throw new Error(error.response.data.message || 'Erreur du serveur.');
        }

        // Gérer les autres types d'erreurs
        throw new Error('Une erreur inattendue est survenue lors de la récupération de la progression.');
    }
}

export async function getTacheThemeFormationForDropDown({lang }: {lang:string }): Promise<TacheThemeFormationReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/all`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const programmesFormations: TacheThemeFormationReturnGetType = response.data.data;
        
        return programmesFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function executerTacheTheme({ tacheId, themeId, statut, lang}: {tacheId:string, themeId:string, statut:string, lang:string}): Promise<ReponseApiPros> {
   
    console.log("execution en cours")
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,{tacheId, themeId, statut},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating tachethemeformation:', error);
        throw error;
    }
}

export async function reinitialiserStatutTaches({lang}: {lang:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/reinitialiser-toutes`,{lang},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating tachethemeformation:', error);
        throw error;
    }
}

export async function marquerExecuteTacheThemeFormation({ tacheId, currentUserId, lang}: {tacheId:string, currentUserId:string, lang:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${tacheId}/executer/${currentUserId}`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating tachethemeformation:', error);
        throw error;
    }
}





