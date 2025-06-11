import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/grades`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createGrade({nomFr, nomEn, descriptionFr, descriptionEn }: Grade, lang:string): Promise<ReponseApiPros> {
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
        console.error('Error creating grade:', error);
        throw error;
    }
}

export async function updateGrade({ _id, nomFr, nomEn, descriptionFr, descriptionEn }: Grade, lang:string): Promise<ReponseApiPros> {
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
        console.error('Error updating grade:', error);
        throw error;
    }
}

export async function deleteGrade(gradeId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${gradeId}`,
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
        console.error('Error deleting grade:', error);
        throw error;
    }
}

export async function getGrades({page, lang }: {page: number, lang:string }): Promise<GradeReturnGetType> {
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
        const grades: GradeReturnGetType = response.data.data;
        
        return grades;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getGrade({id, lang }: {id: string, lang:string }): Promise<GradeReturnGetType> {
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
        const grades: GradeReturnGetType = response.data.data;
        
        return grades;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchGrade({ searchString, lang }: { lang:string, searchString: string}): Promise<GradeReturnGetType> {
   
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
        const grades: GradeReturnGetType = response.data.data;

        return grades;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getGradesForDropDown({lang }: {lang:string }): Promise<GradeReturnGetType> {
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
        const grades: GradeReturnGetType = response.data.data;
        
        return grades;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
