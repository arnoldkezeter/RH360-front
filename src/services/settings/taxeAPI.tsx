import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/taxes`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createTaxe({natureFr, natureEn, taux }: Taxe, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {natureFr, natureEn, taux },
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
        console.error('Error creating Taxe:', error);
        throw error;
    }
}

export async function updateTaxe({ _id, natureFr, natureEn, taux }: Taxe, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {natureFr, natureEn, taux },
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
        console.error('Error updating Taxe:', error);
        throw error;
    }
}

export async function deleteTaxe(TaxeId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${TaxeId}`,
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
        console.error('Error deleting Taxe:', error);
        throw error;
    }
}

export async function getTaxes({page, lang }: {page: number, lang:string }): Promise<TaxeReturnGetType> {
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
        const Taxes: TaxeReturnGetType = response.data.data;
        
        return Taxes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTaxe({id, lang }: {id: string, lang:string }): Promise<TaxeReturnGetType> {
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
        const Taxes: TaxeReturnGetType = response.data.data;
        
        return Taxes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchTaxe({ searchString, lang }: { lang:string, searchString: string}): Promise<TaxeReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/search/by-nature`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    nature:searchString
                }
            },
        );
        const Taxes: TaxeReturnGetType = response.data.data;

        return Taxes;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTaxesBytaux({tauxId, lang }: {tauxId: string, lang:string }): Promise<TaxeReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/taux/${tauxId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Taxes: TaxeReturnGetType = response.data.data;
        
        return Taxes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

