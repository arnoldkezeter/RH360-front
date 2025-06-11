import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/Regions`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createRegion({code, nomFr, nomEn }: Region, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {code, nomFr, nomEn },
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
        console.error('Error creating Region:', error);
        throw error;
    }
}

export async function updateRegion({ _id, code, nomFr, nomEn }: Region, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {code, nomFr, nomEn },
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
        console.error('Error updating Region:', error);
        throw error;
    }
}

export async function deleteRegion(RegionId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${RegionId}`,
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
        console.error('Error deleting Region:', error);
        throw error;
    }
}

export async function getRegions({page, lang }: {page: number, lang:string }): Promise<RegionReturnGetType> {
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
        const Regions: RegionReturnGetType = response.data.data;
        
        return Regions;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getRegion({id, lang }: {id: string, lang:string }): Promise<RegionReturnGetType> {
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
        const Regions: RegionReturnGetType = response.data.data;
        
        return Regions;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchRegion({ searchString, lang }: { lang:string, searchString: string}): Promise<RegionReturnGetType> {
   
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
                    nom:searchString
                }
            },
        );
        const Regions: RegionReturnGetType = response.data.data;

        return Regions;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getRegionsForDropDown({lang }: {lang:string }): Promise<RegionReturnGetType> {
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
        const regions: RegionReturnGetType = response.data.data;
        
        return regions;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
