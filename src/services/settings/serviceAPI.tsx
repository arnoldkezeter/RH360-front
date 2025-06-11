import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/services`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createService({nomFr, nomEn, descriptionFr, descriptionEn, structure, nbPlaceStage }: Service, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn, descriptionFr, descriptionEn, structure, nbPlaceStage },
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
        console.error('Error creating Service:', error);
        throw error;
    }
}

export async function updateService({ _id, nomFr, nomEn, descriptionFr, descriptionEn, structure, nbPlaceStage }: Service, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn, descriptionFr, descriptionEn, structure, nbPlaceStage },
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
        console.error('Error updating Service:', error);
        throw error;
    }
}

export async function deleteService(ServiceId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${ServiceId}`,
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
        console.error('Error deleting Service:', error);
        throw error;
    }
}

export async function getServices({page, lang }: {page: number, lang:string }): Promise<ServiceReturnGetType> {
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
        const Services: ServiceReturnGetType = response.data.data;
        
        return Services;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getService({id, lang }: {id: string, lang:string }): Promise<ServiceReturnGetType> {
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
        const Services: ServiceReturnGetType = response.data.data;
        
        return Services;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchService({ searchString, lang }: { lang:string, searchString: string}): Promise<ServiceReturnGetType> {
   
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
        const Services: ServiceReturnGetType = response.data.data;

        return Services;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getServicesBystructure({page, structureId, lang }: {page:number, structureId: string, lang:string }): Promise<ServiceReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/structure/${structureId}`,
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
        const Services: ServiceReturnGetType = response.data.data;
        
        return Services;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

