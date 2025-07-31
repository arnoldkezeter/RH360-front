import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config';


// Configuration de base
const api = `${apiUrl}/evaluations-a-chaud-reponses`; // Adapter selon votre config
const token = `Bearer ${localStorage.getItem(wstjqer)}`;

// Service pour sauvegarder un brouillon
export async function saveDraftEvaluationAChaudReponse(reponseData: Omit<EvaluationAChaudReponse, '_id' | 'statut' | 'dateFinition' | 'createdAt' | 'updatedAt'>, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/draft`,
            reponseData,
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
        console.error('Error saving draft evaluation:', error);
        throw error;
    }
}

// Service pour récupérer un brouillon
export async function getDraftEvaluationAChaudReponse(utilisateur: string,modele: string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/brouillon/${utilisateur}/${modele}`,
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
        console.error('Error getting draft evaluation:', error);
        throw error;
    }
}

// Service pour lister les brouillons d'un utilisateur
export async function getUserDrafts(utilisateur: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/drafts/${utilisateur}`,
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
        console.error('Error getting user drafts:', error);
        throw error;
    }
}

export async function getUserEvaluations({page, lang, search, userId }: {page: number, lang: string, search?: string, userId:string }): Promise<EvaluationChaudReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/utilisateur/${userId}`,
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
// 1. Soumettre une réponse à une évaluation
export async function submitEvaluationAChaudReponse(reponseData: Omit<EvaluationAChaudReponse, '_id' | 'statut' | 'dateFinition' | 'createdAt' | 'updatedAt'>, lang: string): Promise<ReponseApiPros> {
    console.log(reponseData)
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}`,
            reponseData,
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
        console.error('Error submitting final evaluation:', error);
        throw error;
    }
}

// 2. Obtenir le tableau de bord des évaluations
export async function getDashboardEvaluations(lang: string, periode?: number, themeId?: string): Promise<ReponseApiPros> {
    try {
        const params = new URLSearchParams();
        if (periode) params.append('periode', periode.toString());
        if (themeId) params.append('themeId', themeId);

        const response: AxiosResponse<any> = await axios.get(
            `${api}/dashboard?${params.toString()}`,
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
        console.error('Error getting dashboard evaluations:', error);
        throw error;
    }
}

// 3. Obtenir les statistiques d'une évaluation
export async function getEvaluationStats(evaluationId: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}/stats`,
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
        console.error('Error getting evaluation stats:', error);
        throw error;
    }
}

// 4. Obtenir les résultats par rubrique
export async function getResultatsByRubrique(evaluationId: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}/rubriques`,
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
        console.error('Error getting results by rubrique:', error);
        throw error;
    }
}

// 5. Obtenir les détails d'une question spécifique
export async function getQuestionDetails(evaluationId: string, questionId: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}/questions/${questionId}`,
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
        console.error('Error getting question details:', error);
        throw error;
    }
}

// 6. Obtenir les commentaires d'une évaluation
export async function getCommentaires(evaluationId: string, lang: string, page?: number, limit?: number, questionId?: string): Promise<ReponseApiPros> {
    try {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (questionId) params.append('questionId', questionId);

        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}/commentaires?${params.toString()}`,
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
        console.error('Error getting commentaires:', error);
        throw error;
    }
}

// 7. Obtenir la comparaison avec d'autres évaluations
export async function getComparaisonEvaluations(evaluationId: string, lang: string, themeId?: string, periode?: number): Promise<ReponseApiPros> {
    try {
        const params = new URLSearchParams();
        if (themeId) params.append('themeId', themeId);
        if (periode) params.append('periode', periode.toString());

        const response: AxiosResponse<any> = await axios.get(
            `${api}/${evaluationId}/comparaison?${params.toString()}`,
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
        console.error('Error getting comparaison evaluations:', error);
        throw error;
    }
}

// 8. Exporter les données d'une évaluation
export async function exportEvaluationData(evaluationId: string, lang: string, format: 'json' | 'csv' | 'excel' = 'json'): Promise<Blob> {
    try {
        const params = new URLSearchParams();
        params.append('format', format);

        const response: AxiosResponse<Blob> = await axios.get(
            `${api}/${evaluationId}/export?${params.toString()}`,
            {
                headers: {
                    'accept-language': lang,
                    'authorization': token,
                },
                responseType: 'blob'
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error exporting evaluation data:', error);
        throw error;
    }
}

// 9. Fonction utilitaire pour télécharger le fichier exporté
export function downloadExportedFile(blob: Blob, evaluationId: string, format: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const date = new Date().toISOString().split('T')[0];
    const extension = format === 'excel' ? 'xlsx' : format;
    link.download = `evaluation_${evaluationId}_${date}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}