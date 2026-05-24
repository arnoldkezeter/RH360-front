// services/evaluations/evaluationChaudAPI.ts
import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config';

const api   = `${apiUrl}/evaluations-a-chaud`;
const token = () => `Bearer ${localStorage.getItem(wstjqer)}`;

const headers = (lang: string) => ({
    'Content-Type':   'application/json',
    'accept-language': lang,
    'authorization':   token(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// CRUD ÉVALUATION
// ═══════════════════════════════════════════════════════════════════════════════

export async function createEvaluationAChaud(
    evaluationData: {
        titreFr: string;
        titreEn?: string;
        theme: string;             // ID string (pas l'objet complet)
        descriptionFr?: string;
        descriptionEn?: string;
        dateFormation?: Date;
        objectifs?: ObjectifPedagogique[];
        rubriquesPersonnalisees?: RubriquePersonnalisee[];
        actif?: boolean;
    },
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.post(`${api}`, evaluationData, { headers: headers(lang) });
    return response.data;
}

export async function updateEvaluationAChaud(
    id: string,
    evaluationData: Partial<{
        titreFr: string;
        titreEn: string;
        theme: string;
        descriptionFr: string;
        descriptionEn: string;
        dateFormation: Date;
        objectifs: ObjectifPedagogique[];
        rubriquesPersonnalisees: RubriquePersonnalisee[];
        actif: boolean;
    }>,
    lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.put(`${api}/${id}`, evaluationData, { headers: headers(lang) });
    return response.data;
}

export async function deleteEvaluationAChaud(id: string, lang: string): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.delete(`${api}/${id}`, { headers: headers(lang) });
    return response.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LECTURE
// ═══════════════════════════════════════════════════════════════════════════════

export async function getFilteredEvaluations({
    page, lang, search,
}: {
    page: number; lang: string; search?: string;
}): Promise<EvaluationChaudReturnGetType> {
    const response: AxiosResponse = await axios.get(`${api}/`, {
        headers: headers(lang),
        params: { page, limit: 10, search },
    });
   
    return response.data.data;
}

export async function getEvaluationChaudForDropDown({
    lang, themeId,
}: {
    lang: string; themeId: string;
}): Promise<EvaluationChaudReturnGetType> {
    const response: AxiosResponse = await axios.get(`${api}/dropdown-all/${themeId}`, { headers: headers(lang) });
    return response.data.data;
}

export async function getEvaluationAChaudById(id: string, lang: string): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.get(`${api}/${id}`, { headers: headers(lang) });
    return response.data;
}

/**
 * Évaluations accessibles par l'utilisateur connecté (via cohortes).
 * CORRECTION : URL /user/:userId (anciennement /user-evaluations/:userId)
 */
export async function getUserEvaluations({
    page, lang, search, userId,
}: {
    page: number; lang: string; search?: string; userId: string;
}): Promise<EvaluationChaudReturnGetType> {
    const response: AxiosResponse = await axios.get(`${api}/user/${userId}`, {
        headers: headers(lang),
        params: { page, limit: 10, search },
    });
    return response.data.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTIQUES & RAPPORT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * CORRECTION : URL /stats/:evaluationId (anciennement /:evaluationId/stats dans l'autre fichier)
 */
export async function getEvaluationStats(evaluationId: string, lang: string): Promise<StatsGenerales> {
    const response: AxiosResponse = await axios.get(`${api}/stats/${evaluationId}`, { headers: headers(lang) });
    return response.data.data;
}

/**
 * CORRECTION : URL /stats/:evaluationId/rubriques
 */
export async function getResultatsByRubrique(evaluationId: string, lang: string): Promise<StatsRubrique[]> {
    const response: AxiosResponse = await axios.get(`${api}/stats/${evaluationId}/rubriques`, { headers: headers(lang) });
    return response.data.data;
}

/**
 * CORRECTION : URL /stats/:evaluationId/question/:questionId
 */
export async function getQuestionDetails(
    evaluationId: string, questionId: string, lang: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.get(
        `${api}/stats/${evaluationId}/question/${questionId}`,
        { headers: headers(lang) }
    );
    return response.data;
}

/**
 * CORRECTION : URL /stats/:evaluationId/commentaires
 */
export async function getCommentaires(
    evaluationId: string, lang: string, limit?: number
): Promise<{ questionId: string; question: string; commentaires: string[] }[]> {
    const response: AxiosResponse = await axios.get(`${api}/stats/${evaluationId}/commentaires`, {
        headers: headers(lang),
        params: { limit },
    });
    return response.data.data;
}

/**
 * CORRECTION : déplacé ici depuis evaluationChaudReponseAPI (le dashboard est dans evaluationAChaudController)
 */
export async function getDashboardEvaluations(
    lang: string, periode?: number, themeId?: string
): Promise<ReponseApiPros> {
    const response: AxiosResponse = await axios.get(`${api}/dashboard`, {
        headers: headers(lang),
        params: { periode, themeId },
    });
    return response.data;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Télécharge la fiche PDF.
 * Sans reponseId → fiche vierge (pour impression papier).
 * Avec reponseId → fiche remplie.
 */
export async function exportFichePDF(evaluationId: string, lang: string, reponseId?: string): Promise<void> {
    const params: Record<string, string> = {};
    if (reponseId) params['reponseId'] = reponseId;

    const response: AxiosResponse<Blob> = await axios.get(`${api}/export-pdf/${evaluationId}`, {
        headers: { 'accept-language': lang, 'authorization': token() },
        params,
        responseType: 'blob',
    });

    const url  = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href  = url;
    link.download = reponseId
        ? `evaluation_${evaluationId}_reponse_${reponseId}.pdf`
        : `evaluation_${evaluationId}_vierge.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

/**
 * Récupère la définition JSON Google Forms.
 * Retourne { form, requests } à utiliser avec l'API Google Forms v1.
 */
export async function exportGoogleForms(evaluationId: string, lang: string): Promise<{
    form: object;
    requests: object[];
    instructions: string[];
}> {
    const response: AxiosResponse = await axios.get(`${api}/google-forms/${evaluationId}`, {
        headers: headers(lang),
    });
    return response.data.data;
}


// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION ET PERSONNALISATION
// ═══════════════════════════════════════════════════════════════════════════════

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