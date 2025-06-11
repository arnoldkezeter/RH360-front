import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/communes`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createCommune({code, nomFr, nomEn, departement }: Commune, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {code, nomFr, nomEn, departement },
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
        console.error('Error creating Commune:', error);
        throw error;
    }
}

export async function updateCommune({ _id, code, nomFr, nomEn, departement }: Commune, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {code, nomFr, nomEn, departement },
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
        console.error('Error updating Commune:', error);
        throw error;
    }
}

export async function deleteCommune(CommuneId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${CommuneId}`,
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
        console.error('Error deleting Commune:', error);
        throw error;
    }
}

export async function getCommunes({page, lang }: {page: number, lang:string }): Promise<CommuneReturnGetType> {
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
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Communes: CommuneReturnGetType = response.data.data;
        
        return Communes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCommune({id, lang }: {id: string, lang:string }): Promise<CommuneReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Communes: CommuneReturnGetType = response.data.data;
        
        return Communes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchCommune({ searchString, lang }: { lang:string, searchString: string}): Promise<CommuneReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/search/by-name-or-code`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    term:searchString
                }
            },
        );
        const Communes: CommuneReturnGetType = response.data.data;

        return Communes;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCommunesByDepartement({page, departementId, lang }: {page:number, departementId: string, lang:string }): Promise<CommuneReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/departement/${departementId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    page:page,
                    limit:pageSize
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Communes: CommuneReturnGetType = response.data.data;
        
        return Communes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

