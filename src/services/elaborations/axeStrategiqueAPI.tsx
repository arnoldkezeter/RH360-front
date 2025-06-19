import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/axes-strategiques`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createAxeStrategique({nomFr, nomEn, descriptionFr, descriptionEn }: AxeStrategique, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn, descriptionFr, descriptionEn },
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
        console.error('Error creating axestrategique:', error);
        throw error;
    }
}

export async function updateAxeStrategique({ _id, nomFr, nomEn, descriptionFr, descriptionEn }: AxeStrategique, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn,  descriptionFr, descriptionEn },
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
        console.error('Error updating axestrategique:', error);
        throw error;
    }
}

export async function deleteAxeStrategique(axestrategiqueId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${axestrategiqueId}`,
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
        console.error('Error deleting axestrategique:', error);
        throw error;
    }
}

export async function getAxeStrategiques({page, lang }: {page: number, lang:string }): Promise<AxeStrategiqueReturnGetType> {
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
        const axestrategiques: AxeStrategiqueReturnGetType = response.data.data;
        
        return axestrategiques;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getAxeStrategique({id, lang }: {id: string, lang:string }): Promise<AxeStrategiqueReturnGetType> {
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
        const axestrategiques: AxeStrategiqueReturnGetType = response.data.data;
        
        return axestrategiques;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchAxeStrategique({ searchString, lang }: { lang:string, searchString: string}): Promise<AxeStrategiqueReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/search/by-name`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    nom:searchString
                }
            },
        );
        const axestrategiques: AxeStrategiqueReturnGetType = response.data.data;

        return axestrategiques;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getAxesStrategiqueForDropDown({lang }: {lang:string }): Promise<AxeStrategiqueReturnGetType> {
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
        const axeStrategiques: AxeStrategiqueReturnGetType = response.data.data;
        
        return axeStrategiques;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
