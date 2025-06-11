import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/structures`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createStructure({nomFr, nomEn, descriptionFr, descriptionEn }: Structure, lang:string): Promise<ReponseApiPros> {
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
        console.error('Error creating structure:', error);
        throw error;
    }
}

export async function updateStructure({ _id, nomFr, nomEn, descriptionFr, descriptionEn }: Structure, lang:string): Promise<ReponseApiPros> {
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
        console.error('Error updating structure:', error);
        throw error;
    }
}

export async function deleteStructure(structureId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${structureId}`,
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
        console.error('Error deleting structure:', error);
        throw error;
    }
}

export async function getStructures({page, lang }: {page: number, lang:string }): Promise<StructureReturnGetType> {
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
        const structures: StructureReturnGetType = response.data.data;
        
        return structures;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getStructure({id, lang }: {id: string, lang:string }): Promise<StructureReturnGetType> {
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
        const structures: StructureReturnGetType = response.data.data;
        
        return structures;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchStructure({ searchString, lang }: { lang:string, searchString: string}): Promise<StructureReturnGetType> {
   
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
        const structures: StructureReturnGetType = response.data.data;

        return structures;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getStructuresForDropDown({lang }: {lang:string }): Promise<StructureReturnGetType> {
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
        const structures: StructureReturnGetType = response.data.data;
        
        return structures;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}