import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer,  } from '../../config.js'

const token = localStorage.getItem(wstjqer);

export async function apiGetAllSettings(): Promise<DataSettingProps> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${apiUrl}/settings`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const settings: DataSettingProps = response.data.settings;

        return settings;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiUpdateAnneeCourante({annee}:{annee:number}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${apiUrl}/setting/annee/updateAnneeCourante`, {annee},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const newAnnee = response.data;

        return newAnnee;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiUpdateSemestreCourant({semestre}:{semestre:number}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${apiUrl}/setting/semestre/updateSemestreCourant`, {semestre},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    semestre:semestre,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const newSemestre = response.data;

        return newSemestre;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function apiUpdateTauxHoraire({tauxHoraire}:{tauxHoraire:number}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${apiUrl}/setting/taux-horaire/updateTauxHoraire`, {tauxHoraire},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params:{
                    tauxHoraire:tauxHoraire,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const newTaux = response.data;

        return newTaux;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


