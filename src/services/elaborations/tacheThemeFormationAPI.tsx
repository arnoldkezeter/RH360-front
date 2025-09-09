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
            `${api}/${_id}`,
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

export async function getFilteredTacheThemeFormations({page, lang,themeId, dateDebut, dateFin, executee, search }: {page: number, lang:string,themeId?:string, executee?:boolean, dateDebut?:string, dateFin?:string, search?:string }): Promise<TacheThemeFormationReturnGetType> {
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
        const url = `${api}/progression-taches/${themeId}`;

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

export async function updateStatutTacheThemeFormation({ tacheId, currentUser, statut,donnees, lang}: {tacheId:string, currentUser:string, statut:string, donnees?:any,lang:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${tacheId}/${currentUser}`,{statut, donnees},
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
            `${api}`,{lang},
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





