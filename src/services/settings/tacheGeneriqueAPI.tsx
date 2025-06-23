import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/taches-generiques`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createTacheGenerique({nomFr, nomEn, descriptionFr, descriptionEn, methodeValidation }: TacheGenerique, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn, descriptionFr, descriptionEn, methodeValidation },
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
        console.error('Error creating tacheGenerique:', error);
        throw error;
    }
}

export async function updateTacheGenerique({ _id, nomFr, nomEn, descriptionFr, descriptionEn, methodeValidation }: TacheGenerique, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn,  descriptionFr, descriptionEn, methodeValidation },
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
        console.error('Error updating tacheGenerique:', error);
        throw error;
    }
}

export async function deleteTacheGenerique(tacheGeneriqueId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${tacheGeneriqueId}`,
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
        console.error('Error deleting tacheGenerique:', error);
        throw error;
    }
}

export async function getTacheGeneriques({page, search, lang }: {page?: number, search?:string, lang?:string }): Promise<TacheGeneriqueReturnGetType> {
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
                    nom:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const tacheGeneriques: TacheGeneriqueReturnGetType = response.data.data;
        
        return tacheGeneriques;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTacheGenerique({id, lang }: {id: string, lang:string }): Promise<TacheGeneriqueReturnGetType> {
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
        const tacheGeneriques: TacheGeneriqueReturnGetType = response.data.data;
        
        return tacheGeneriques;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchTacheGenerique({ searchString, lang }: { lang:string, searchString: string}): Promise<TacheGeneriqueReturnGetType> {
   
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
        const tacheGeneriques: TacheGeneriqueReturnGetType = response.data.data;

        return tacheGeneriques;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getTacheGeneriquesForDropDown({lang }: {lang:string }): Promise<TacheGeneriqueReturnGetType> {
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
        const tacheGeneriques: TacheGeneriqueReturnGetType = response.data.data;
        
        return tacheGeneriques;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}