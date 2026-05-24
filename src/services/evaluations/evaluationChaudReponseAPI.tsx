// services/evaluations/evaluationChaudReponseAPI.ts
import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config';

const api   = `${apiUrl}/evaluations-a-chaud-reponses`;
const token = () => `Bearer ${localStorage.getItem(wstjqer)}`;

const headers = (lang: string) => ({
    'Content-Type':    'application/json',
    'accept-language': lang,
    'authorization':   token(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// SOUMISSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sauvegarde un brouillon (peut être appelé plusieurs fois).
 * CORRECTION : URL /brouillon (anciennement /draft)
 */
export async function saveDraftEvaluationAChaudReponse(
    reponseData: EvaluationReponsePayload,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}/brouillon`, reponseData, { headers: headers(lang) });
    return response.data;
}

/**
 * Soumet une réponse définitive (irréversible).
 * CORRECTION : URL /soumettre (anciennement /)
 */
export async function submitEvaluationAChaudReponse(
    reponseData: EvaluationReponsePayload,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}/soumettre`, reponseData, { headers: headers(lang) });
    return response.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LECTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Réponse d'un utilisateur pour une évaluation précise (brouillon ou soumis).
 * CORRECTION : URL /:utilisateurId/:modeleId (anciennement /brouillon/:u/:m)
 */
export async function getReponseUtilisateur(
    utilisateurId: string,
    modeleId: string,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.get(
        `${api}/${utilisateurId}/${modeleId}`,
        { headers: headers(lang) }
    );
    return response.data;
}

/**
 * Toutes les réponses d'un utilisateur (liste paginée).
 * URL inchangée : /utilisateur/:utilisateurId
 */
export async function getUserEvaluationReponses({
    page, lang, userId,
}: {
    page: number; lang: string; userId: string;
}): Promise<{ reponses: EvaluationAChaudReponse[]; totalItems: number; currentPage: number; totalPages: number; pageSize: number }> {
    const response: AxiosResponse = await axios.get(`${api}/utilisateur/${userId}`, {
        headers: headers(lang),
        params: { page, limit: 10 },
    });
    return response.data.data;
}

/**
 * Toutes les réponses pour une évaluation (vue admin).
 * URL : /evaluation/:evaluationId
 */
export async function getReponsesParEvaluation({
    evaluationId, page, lang,
}: {
    evaluationId: string; page: number; lang: string;
}): Promise<{ reponses: EvaluationAChaudReponse[]; totalItems: number; currentPage: number; totalPages: number; pageSize: number }> {
    const response: AxiosResponse = await axios.get(`${api}/evaluation/${evaluationId}`, {
        headers: headers(lang),
        params: { page, limit: 10 },
    });
    return response.data.data;
}

