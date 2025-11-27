import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/theme-formation/lieux-formation`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function createLieuFormation({lieu, cohortes, participants, dateDebut, dateFin}:LieuFormationInput, themeId:string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${themeId}/lieu`,
            { lieu, cohortes, participants, dateDebut, dateFin },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error adding lieu to lieu:', error);
        throw error;
    }
}


export async function updateLieuFormation({_id, lieu, cohortes, participants, dateDebut, dateFin, dateDebutEffective, dateFinEffective}:LieuFormationInput,themeId:string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${themeId}/lieu/${_id}`,
            { lieu, cohortes, participants, dateDebut, dateFin, dateDebutEffective, dateFinEffective },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating lieu in lieu:', error);
        throw error;
    }
}

export async function deleteLieuFormation(themeId: string,lieuId: string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${themeId}/lieu/${lieuId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting lieu from lieu:', error);
        throw error;
    }
}

export async function getFilteredLieuFormations({page, lang, search, themeId }: {page: number, lang:string, search?:string, themeId:string }): Promise<LieuFormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    query:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const lieuFormations: LieuFormationReturnGetType = response.data.data;
        
        return lieuFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getLieuFormationForDropDown({lang, themeId }: {lang:string, themeId:string }): Promise<LieuFormationReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/all/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const programmesFormations: LieuFormationReturnGetType = response.data.data;
        
        return programmesFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}






