import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/departements`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createDepartement({code, nomFr, nomEn, region }: Departement, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {code, nomFr, nomEn, region },
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
        console.error('Error creating Departement:', error);
        throw error;
    }
}

export async function updateDepartement({ _id, code, nomFr, nomEn, region }: Departement, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {code, nomFr, nomEn, region },
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
        console.error('Error updating Departement:', error);
        throw error;
    }
}

export async function deleteDepartement(DepartementId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${DepartementId}`,
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
        console.error('Error deleting Departement:', error);
        throw error;
    }
}

export async function getDepartements({page, lang }: {page: number, lang:string }): Promise<DepartementReturnGetType> {
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
        const Departements: DepartementReturnGetType = response.data.data;
        
        return Departements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getDepartement({id, lang }: {id: string, lang:string }): Promise<DepartementReturnGetType> {
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
        const Departements: DepartementReturnGetType = response.data.data;
        
        return Departements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchDepartement({ searchString, lang }: { lang:string, searchString: string}): Promise<DepartementReturnGetType> {
   
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
        const Departements: DepartementReturnGetType = response.data.data;

        return Departements;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getDepartementsByRegion({page, regionId, lang }: {page: number, regionId: string, lang:string }): Promise<DepartementReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/region/${regionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    page : page,
                    limit: pageSize
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Departements: DepartementReturnGetType = response.data.data;
        
        return Departements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getDepartementsForDropDown({regionId, lang }: {regionId:string, lang:string }): Promise<DepartementReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/all/${regionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const departements: DepartementReturnGetType = response.data.data;
        
        return departements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

