import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/Etablissements`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createEtablissement({nomFr, nomEn }: Etablissement, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn },
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
        console.error('Error creating Etablissement:', error);
        throw error;
    }
}

export async function updateEtablissement({ _id, nomFr, nomEn }: Etablissement, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn },
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
        console.error('Error updating Etablissement:', error);
        throw error;
    }
}

export async function deleteEtablissement(EtablissementId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${EtablissementId}`,
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
        console.error('Error deleting Etablissement:', error);
        throw error;
    }
}

export async function getEtablissements({page, lang }: {page: number, lang:string }): Promise<EtablissementReturnGetType> {
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
        const Etablissements: EtablissementReturnGetType = response.data.data;
        
        return Etablissements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getEtablissement({id, lang }: {id: string, lang:string }): Promise<EtablissementReturnGetType> {
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
        const Etablissements: EtablissementReturnGetType = response.data.data;
        
        return Etablissements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchEtablissement({ searchString, lang, limit }: { lang:string, searchString: string, limit?:number}): Promise<EtablissementReturnGetType> {
   
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
                    nom:searchString,
                    limit:limit
                }
            },
        );
        const Etablissements: EtablissementReturnGetType = response.data.data;

        return Etablissements;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getEtablissementsForDropDown({lang }: {lang:string }): Promise<EtablissementReturnGetType> {
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
        const Etablissements: EtablissementReturnGetType = response.data.data;
        
        return Etablissements;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}