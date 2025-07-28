import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/type-echelle-reponse/echelles-reponses`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function createEchelleReponse({nomFr, nomEn}:EchelleReponse,typeEchelleId:string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${typeEchelleId}`,
            { nomFr, nomEn },
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
        console.error('Error adding echelle to echelles:', error);
        throw error;
    }
}


export async function updateEchelleReponse({_id, nomFr, nomEn}:EchelleReponse,typeEchelleId:string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${typeEchelleId}/${_id}`,
            { nomFr, nomEn },
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
        console.error('Error updating echelle in echelles:', error);
        throw error;
    }
}

export async function deleteEchelleReponse(echelleId: string,lang: string): Promise<ReponseApiPros> {
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
        console.error('Error deleting echelle from echelles:', error);
        throw error;
    }
}

export async function getFilteredEchelleReponses({page, lang, search, typeEchelleId }: {page: number, lang:string, search?:string, typeEchelleId:string }): Promise<EchelleReponseReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre/${typeEchelleId}`,
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
        const echelleReponses: EchelleReponseReturnGetType = response.data.data;
        
        return echelleReponses;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getEchelleReponseForDropDown({lang, typeEchelleId }: {lang:string, typeEchelleId:string }): Promise<EchelleReponseReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/all/${typeEchelleId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const echellesReponses: EchelleReponseReturnGetType = response.data.data;
        
        return echellesReponses;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getGroupedEchelleReponseByType({lang }: {lang:string}): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/grouped-by-type`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const echellesReponses: EchelleReponseReturnGetType = response.data.data;
        
        return echellesReponses;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}






