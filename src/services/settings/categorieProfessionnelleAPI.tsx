import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/categories-professionnelles`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createCategorieProfessionnelle({nomFr, nomEn, descriptionFr, descriptionEn, grade }: CategorieProfessionnelle, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn, descriptionFr, descriptionEn, grade },
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
        console.error('Error creating CategorieProfessionnelle:', error);
        throw error;
    }
}

export async function updateCategorieProfessionnelle({ _id, nomFr, nomEn, descriptionFr, descriptionEn, grade }: CategorieProfessionnelle, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn, descriptionFr, descriptionEn, grade },
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
        console.error('Error updating CategorieProfessionnelle:', error);
        throw error;
    }
}

export async function deleteCategorieProfessionnelle(categorieProfessionnelleId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${categorieProfessionnelleId}`,
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
        console.error('Error deleting CategorieProfessionnelle:', error);
        throw error;
    }
}

export async function getCategorieProfessionnelles({page, lang }: {page: number, lang:string }): Promise<CategorieProfessionnelleReturnGetType> {
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
        const CategorieProfessionnelles: CategorieProfessionnelleReturnGetType = response.data.data;
        
        return CategorieProfessionnelles;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCategorieProfessionnelle({id, lang }: {id: string, lang:string }): Promise<CategorieProfessionnelleReturnGetType> {
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
        const CategorieProfessionnelles: CategorieProfessionnelleReturnGetType = response.data.data;
        
        return CategorieProfessionnelles;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchCategorieProfessionnelle({ searchString, lang }: { lang:string, searchString: string}): Promise<CategorieProfessionnelleReturnGetType> {
   
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
        const CategorieProfessionnelles: CategorieProfessionnelleReturnGetType = response.data.data;

        return CategorieProfessionnelles;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCategorieProfessionnellesByGrade({page, gradeId, lang }: {page:number, gradeId: string, lang:string }): Promise<CategorieProfessionnelleReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/grade/${gradeId}`,
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
        const CategorieProfessionnelles: CategorieProfessionnelleReturnGetType = response.data.data;
        
        return CategorieProfessionnelles;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCategorieProfessionnellesForDropDown({gradeId, lang }: {gradeId:string, lang:string }): Promise<CategorieProfessionnelleReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/grade/${gradeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const communes: CategorieProfessionnelleReturnGetType = response.data.data;
        
        return communes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

