import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/competences`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createCompetence({code, nomFr, nomEn, descriptionFr, descriptionEn, familleMetier }: Competence, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {code, nomFr, nomEn, descriptionFr, descriptionEn, familleMetier },
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
        console.error('Error creating Competence:', error);
        throw error;
    }
}

export async function updateCompetence({ _id, code, nomFr, nomEn, descriptionFr, descriptionEn, familleMetier }: Competence, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {code, nomFr, nomEn, descriptionFr, descriptionEn, familleMetier },
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
        console.error('Error updating Competence:', error);
        throw error;
    }
}

export async function deleteCompetence(competenceId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${competenceId}`,
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
        console.error('Error deleting Competence:', error);
        throw error;
    }
}

export async function getCompetences({page, lang }: {page: number, lang:string }): Promise<CompetenceReturnGetType> {
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
        const Competences: CompetenceReturnGetType = response.data.data;
        
        return Competences;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCompetence({id, lang }: {id: string, lang:string }): Promise<CompetenceReturnGetType> {
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
        const Competences: CompetenceReturnGetType = response.data.data;
        
        return Competences;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchCompetence({ searchString, lang }: { lang:string, searchString: string}): Promise<CompetenceReturnGetType> {
   
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
        const Competences: CompetenceReturnGetType = response.data.data;

        return Competences;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCompetencesByFamilleMetier({page, familleMetierId, lang }: {page:number, familleMetierId: string, lang:string }): Promise<CompetenceReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/famille-metier/${familleMetierId}`,
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
        const Competences: CompetenceReturnGetType = response.data.data;
        
        return Competences;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

