import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/types-echelles-reponses`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function createTypeEchelleReponse({descriptionFr, descriptionEn,nomFr, nomEn}:TypeEchelleReponse, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {descriptionFr, descriptionEn, nomFr, nomEn },
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
        console.error('Error adding objectif to objectif:', error);
        throw error;
    }
}


export async function updateTypeEchelleReponse({_id, descriptionFr, descriptionEn, nomFr, nomEn}:TypeEchelleReponse,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {descriptionFr, descriptionEn, nomFr, nomEn },
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
        console.error('Error updating objectif in objectif:', error);
        throw error;
    }
}

export async function deleteTypeEchelleReponse(echelleId: string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${echelleId}`,
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
        console.error('Error deleting objectif from objectif:', error);
        throw error;
    }
}

export async function getFilteredTypeEchelleReponses({page, lang, search }: {page: number, lang:string, search?:string}): Promise<TypeEchelleReponseReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/`,
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
        const typeEchelleReponses: TypeEchelleReponseReturnGetType = response.data.data;
        
        return typeEchelleReponses;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTypeEchelleReponseForDropDown({lang }: {lang:string}): Promise<TypeEchelleReponseReturnGetType> {
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
        const typeEchelleReponses: TypeEchelleReponseReturnGetType = response.data.data;
        
        return typeEchelleReponses;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}






