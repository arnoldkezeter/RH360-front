import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/familles-de-metier`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createFamilleMetier({nomFr, nomEn, descriptionFr, descriptionEn }: FamilleMetier, lang:string): Promise<ReponseApiPros> {
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
        console.error('Error creating famillemetier:', error);
        throw error;
    }
}

export async function updateFamilleMetier({ _id, nomFr, nomEn, descriptionFr, descriptionEn }: FamilleMetier, lang:string): Promise<ReponseApiPros> {
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
        console.error('Error updating famillemetier:', error);
        throw error;
    }
}

export async function deleteFamilleMetier(famillemetierId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${famillemetierId}`,
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
        console.error('Error deleting famillemetier:', error);
        throw error;
    }
}

export async function getFamilleMetiers({page, lang }: {page: number, lang:string }): Promise<FamilleMetierReturnGetType> {
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
        const famillemetiers: FamilleMetierReturnGetType = response.data.data;
        
        return famillemetiers;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getFamilleMetier({id, lang }: {id: string, lang:string }): Promise<FamilleMetierReturnGetType> {
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
        const famillemetiers: FamilleMetierReturnGetType = response.data.data;
        
        return famillemetiers;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchFamilleMetier({ searchString, lang }: { lang:string, searchString: string}): Promise<FamilleMetierReturnGetType> {
   
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
        const famillemetiers: FamilleMetierReturnGetType = response.data.data;

        return famillemetiers;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getFamillesMetierForDropDown({lang }: {lang:string }): Promise<FamilleMetierReturnGetType> {
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
        const famillesMetier: FamilleMetierReturnGetType = response.data.data;
        
        return famillesMetier;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
