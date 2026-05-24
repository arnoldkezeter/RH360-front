// services/evaluations/rubriqueStatiqueAPI.ts
import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config';

const api = `${apiUrl}/rubriques-statiques`;
const token = () => `Bearer ${localStorage.getItem(wstjqer)}`;

const headers = (lang: string) => ({
    'Content-Type': 'application/json',
    'accept-language': lang,
    'authorization': token(),
});

/**
 * Récupère toutes les rubriques statiques
 */
export async function getRubriquesStatiques(lang: string): Promise<{
    rubriquesStatiques: RubriqueStatique[];
    totalItems: number;
}> {
    const response: AxiosResponse = await axios.get(`${api}`, {
        headers: headers(lang),
    });
    return response.data.data;
}

/**
 * Récupère une rubrique statique par son code
 */
export async function getRubriqueStatiqueByCode(code: string, lang: string): Promise<RubriqueStatique & { questions: QuestionStatique[] }> {
    const response: AxiosResponse = await axios.get(`${api}/${code}`, {
        headers: headers(lang),
    });
    return response.data.data;
}

/**
 * Met à jour une rubrique statique (admin)
 */
export async function updateRubriqueStatique(
    code: string,
    rubriqueData: Partial<RubriqueStatique>,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.put(`${api}/${code}`, rubriqueData, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Ajoute une question statique (admin)
 */
export async function addQuestionStatique(
    rubriqueCode: string,
    questionData: Omit<QuestionStatique, '_id' | 'code'>,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}/${rubriqueCode}/questions`, questionData, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Met à jour une question statique (admin)
 */
export async function updateQuestionStatique(
    code: string,
    questionData: Partial<QuestionStatique>,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.put(`${api}/questions/${code}`, questionData, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Supprime une question statique (admin)
 */
export async function deleteQuestionStatique(code: string, lang: string): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.delete(`${api}/questions/${code}`, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Initialise les rubriques statiques (admin)
 */
export async function initRubriquesStatiques(lang: string): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}/init`, {}, {
        headers: headers(lang),
    });
    return response.data;
}