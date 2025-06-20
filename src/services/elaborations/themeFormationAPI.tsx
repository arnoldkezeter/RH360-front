import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/themes-formations`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createThemeFormation({titreFr, titreEn, publicCible, dateDebut, dateFin, formateurs, responsable, formation}: ThemeFormation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {titreFr, titreEn, publicCible, dateDebut, dateFin, formateurs, responsable, formation},
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
        console.error('Error creating themeformation:', error);
        throw error;
    }
}

export async function updateThemeFormation({ _id, titreFr, titreEn, publicCible, dateDebut, dateFin, formateurs, responsable, formation }: ThemeFormation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {titreFr, titreEn, publicCible, dateDebut, dateFin, formateurs, responsable, formation},
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
        console.error('Error updating themeformation:', error);
        throw error;
    }
}

export async function deleteThemeFormation(themeformationId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${themeformationId}`,
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
        console.error('Error deleting themeformation:', error);
        throw error;
    }
}

export async function getFilteredThemeFormations({page, lang, familleMetier, formation, dateDebut, dateFin, search }: {page: number, lang:string, familleMetier?:string, formation?:string, dateDebut?:string, dateFin?:string, search?:string }): Promise<ThemeFormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    familleMetier, 
                    formation,
                    debut:dateDebut, 
                    fin:dateFin, 
                    titre:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const themeFormations: ThemeFormationReturnGetType = response.data.data;
        
        return themeFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getThemeFormationForDropDown({lang }: {lang:string }): Promise<ThemeFormationReturnGetType> {
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
        const programmesFormations: ThemeFormationReturnGetType = response.data.data;
        
        return programmesFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function addLieuToTheme(themeId: string,lieu: { lieu: string; cohortes: string[] },lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${themeId}/lieu`,
            { lieu, cohortes: lieu.cohortes },
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
        console.error('Error adding lieu to theme:', error);
        throw error;
    }
}


export async function updateLieuInTheme(themeId: string,lieuId: string,lieuData: { lieu: string; cohortes: string[] },lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${themeId}/lieu/${lieuId}`,
            { lieu: lieuData.lieu, cohortes: lieuData.cohortes },
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
        console.error('Error updating lieu in theme:', error);
        throw error;
    }
}

export async function deleteLieuFromTheme(themeId: string,lieuId: string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${themeId}/lieu/${lieuId}`,
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
        console.error('Error deleting lieu from theme:', error);
        throw error;
    }
}




