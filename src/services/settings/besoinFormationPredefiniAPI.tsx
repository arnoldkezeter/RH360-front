import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/besoins-formation-predefinis`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createBesoinFormationPredefini({titreFr, titreEn, descriptionFr, descriptionEn, posteDeTravail }: BesoinFormationPredefini, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {titreFr, titreEn, descriptionFr, descriptionEn, posteDeTravail },
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
        console.error('Error creating BesoinFormationPredefini:', error);
        throw error;
    }
}

export async function updateBesoinFormationPredefini({ _id, titreFr, titreEn, descriptionFr, descriptionEn, posteDeTravail }: BesoinFormationPredefini, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {titreFr, titreEn, descriptionFr, descriptionEn, posteDeTravail },
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
        console.error('Error updating BesoinFormationPredefini:', error);
        throw error;
    }
}

export async function deleteBesoinFormationPredefini(besoinFormationPredefiniId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${besoinFormationPredefiniId}`,
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
        console.error('Error deleting BesoinFormationPredefini:', error);
        throw error;
    }
}

export async function getBesoinFormationPredefinis({page, lang }: {page: number, lang:string }): Promise<BesoinFormationPredefiniReturnGetType> {
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
        const BesoinFormationPredefinis: BesoinFormationPredefiniReturnGetType = response.data.data;
        
        return BesoinFormationPredefinis;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getBesoinFormationPredefini({id, lang }: {id: string, lang:string }): Promise<BesoinFormationPredefiniReturnGetType> {
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
        const BesoinFormationPredefinis: BesoinFormationPredefiniReturnGetType = response.data.data;
        
        return BesoinFormationPredefinis;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchBesoinFormationPredefini({ searchString, lang }: { lang:string, searchString: string}): Promise<BesoinFormationPredefiniReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/search/by-title`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    titre:searchString
                }
            },
        );
        const BesoinFormationPredefinis: BesoinFormationPredefiniReturnGetType = response.data.data;

        return BesoinFormationPredefinis;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getBesoinFormationPredefinisByPosteDeTravail({page, posteDeTravailId, lang }: {page:number, posteDeTravailId: string, lang:string }): Promise<BesoinFormationPredefiniReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/posteDeTravail/${posteDeTravailId}`,
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
        const BesoinFormationPredefinis: BesoinFormationPredefiniReturnGetType = response.data.data;
        
        return BesoinFormationPredefinis;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

