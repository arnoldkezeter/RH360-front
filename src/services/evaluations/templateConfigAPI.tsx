// services/evaluations/templateConfigAPI.ts
import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config';

const api = `${apiUrl}/evaluations-a-chaud`;
const token = () => `Bearer ${localStorage.getItem(wstjqer)}`;

const headers = (lang: string) => ({
    'Content-Type': 'application/json',
    'accept-language': lang,
    'authorization': token(),
});

/**
 * Récupère la configuration complète d'une évaluation
 * GET /:id/config
 */
export async function getEvaluationConfig(
    evaluationId: string,
    lang: string
): Promise<{
    evaluation: {
        id: string;
        titreFr: string;
        titreEn: string;
        theme: string | ThemeFormation;
    };
    rubriquesStatiques: RubriqueStatique[];
    objectifsBase: ObjectifTheme[];
    config: TemplateConfig;
}> {
    const response: AxiosResponse = await axios.get(`${api}/${evaluationId}/config`, {
        headers: headers(lang),
    });
    return response.data.data;
}

/**
 * Met à jour la configuration d'une évaluation
 * PUT /:id/config
 */
export async function updateEvaluationConfig(
    evaluationId: string,
    configData: {
        rubriquesConfig?: RubriqueConfig[];
        objectifsConfig?: ObjectifsConfig;
    },
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.put(`${api}/${evaluationId}/config`, configData, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Régénère les rubriques d'une évaluation
 * POST /:id/regenerate
 */
export async function regenerateRubriques(
    evaluationId: string,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}/${evaluationId}/regenerate`, {}, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Ajoute un objectif personnalisé à une évaluation
 * POST /:id/objectifs
 */
export async function addObjectifPersonnalise(
    evaluationId: string,
    objectifData: {
        libelleFr: string;
        libelleEn?: string;
        ordre?: number;
    },
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}/${evaluationId}/objectifs`, objectifData, {
        headers: headers(lang),
    });
    return response.data;
}

/**
 * Supprime un objectif personnalisé d'une évaluation
 * DELETE /:id/objectifs/:objectifId
 */
export async function removeObjectifPersonnalise(
    evaluationId: string,
    objectifId: string,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.delete(`${api}/${evaluationId}/objectifs/${objectifId}`, {
        headers: headers(lang),
    });
    return response.data;
}