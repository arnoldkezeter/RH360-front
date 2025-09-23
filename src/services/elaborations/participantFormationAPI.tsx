import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/theme-formation/participants-formation`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function addParticipantFormation({participantId, themeId, lang}:{participantId:string, themeId:string, lang:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${themeId}/participant`,
            {participantId },
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



export async function deleteParticipantFormation({themeId,participantId,lang}:{themeId: string,participantId: string,lang: string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${themeId}/participant/${participantId}`,
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

export async function getFilteredParticipantFormations({page, lang, search, themeId }: {page: number, lang:string, search?:string, themeId:string }): Promise<ParticipantFormationReturnGetType> {
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
        const participantFormations: ParticipantFormationReturnGetType = response.data.data;
        
        return participantFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function searchParticipantFormations({lang, search, themeId }: {lang:string, search?:string, themeId:string }): Promise<ParticipantFormationReturnGetType> {
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
                    query:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const participantFormations: ParticipantFormationReturnGetType = response.data.data;
        
        return participantFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}






