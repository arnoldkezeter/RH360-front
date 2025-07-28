import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config';



// Configuration de base
const api = `${apiUrl}/evaluations-a-chaud`; // Adapter selon votre config
const token = `Bearer ${localStorage.getItem(wstjqer)}`;

// Créer une évaluation à chaud
export async function createEvaluationAChaud(evaluationData: EvaluationChaud, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}`,
            evaluationData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error creating evaluation:', error);
        throw error;
    }
}

// Modifier une évaluation à chaud
export async function updateEvaluationAChaud(id: string, evaluationData: EvaluationChaud, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${id}`,
            evaluationData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating evaluation:', error);
        throw error;
    }
}

// Supprimer une évaluation à chaud
export async function deleteEvaluationAChaud(id: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting evaluation:', error);
        throw error;
    }
}

// Liste paginée des évaluations
export async function getFilteredEvaluations({page, lang, search }: {page: number, lang: string, search?: string }): Promise<EvaluationChaudReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    search: search
                },
            },
        );
        console.log(response.data)
        return response.data.data;
    } catch (error) {
        console.error('Error getting filtered evaluations:', error);
        throw error;
    }
}

// Récupérer une évaluation par ID
export async function getEvaluationAChaudById(id: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error getting evaluation by id:', error);
        throw error;
    }
}

// Dropdown des évaluations actives
export async function getDropdownEvaluations(lang: string): Promise<EvaluationAChaudReponse> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error getting dropdown evaluations:', error);
        throw error;
    }
}