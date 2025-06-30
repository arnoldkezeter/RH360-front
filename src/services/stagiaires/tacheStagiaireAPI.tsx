import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/stagiaire/taches-stagiaire`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


// Créer une tâche stagiaire
export async function createTacheStagiaire({ nomFr, nomEn, descriptionFr, descriptionEn, date, status }: TacheStagiaire, stagiaire:string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(`${api}/`, {nomFr, nomEn, descriptionFr, descriptionEn, date, status, stagiaire}, {
        headers: {
                'Content-Type': 'application/json',
                'accept-language': lang,
                'authorization': token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur création tâche stagiaire :', error);
        throw error;
    }
}

//Modifier une tâche stagiaire
export async function updateTacheStagiaire(tacheId: string, {nomFr, nomEn, descriptionFr, descriptionEn, date, status}: TacheStagiaire, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(`${api}/${tacheId}`, {nomFr, nomEn, descriptionFr, descriptionEn, date, status}, {
        headers: {
                'Content-Type': 'application/json',
                'accept-language': lang,
                'authorization': token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur modification tâche stagiaire :', error);
        throw error;
    }
}

// Supprimer une tâche stagiaire
export async function deleteTacheStagiaire(tacheId: string, lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(`${api}/${tacheId}`, {
        headers: {
                'accept-language': lang,
                'authorization': token,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erreur suppression tâche stagiaire :', error);
        throw error;
    }
}

// Récupérer toutes les tâches stagiaires (avec pagination optionnelle)
export async function getTachesStagiaires({ page, lang, stagiaireId, dateDebut, dateFin, statut, search }: { page?: number, stagiaireId:string, lang: string, dateDebut?:string, dateFin?:string, statut?:string, search?:string }): Promise<TacheStagiaireReturnGetType> {
    const pageSize = 10;
    
    try {
        const response: AxiosResponse<any> = await axios.get(`${api}/${stagiaireId}`, {
        headers: {
            'accept-language': lang,
            'authorization': token,
        },
        params: { 
                page,
                pageSize,
                dateDebut,
                dateFin,
                statut,
                search
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Erreur récupération tâches stagiaires :', error);
        throw error;
    }
}

// Statistiques des tâches stagiaires
export async function getTachesStagiairesStats(lang: string, stagiaireId:string, dateDebut?:string, dateFin?:string): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(`${api}/statistiques/${stagiaireId}`, {
            headers: {
                'accept-language': lang,
                'authorization': token,
            },
            params:{
                dateDebut,
                dateFin
            }

        });
        return response.data;
    } catch (error) {
        console.error('Erreur stats tâches stagiaires :', error);
        throw error;
    }
}
