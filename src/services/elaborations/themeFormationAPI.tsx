import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/themes-formations`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createThemeFormation({titreFr, titreEn, publicCible, dateDebut, dateFin, formateurs, responsable, formation}: ThemeFormationInput, lang:string): Promise<ReponseApiPros> {
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

export async function updateThemeFormation({ _id, titreFr, titreEn, publicCible, dateDebut, dateFin, formateurs, responsable, formation }: ThemeFormationInput, lang:string): Promise<ReponseApiPros> {
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

export async function getFilteredThemeFormations({page, lang, familleMetier, formation, dateDebut, dateFin, search, filterType, userId }: {page?: number, lang:string, familleMetier?:string, formation?:string, dateDebut?:string, dateFin?:string, search?:string, filterType?:string, userId?:string }): Promise<ThemeFormationReturnGetType> {
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
                    titre:search,
                    filterType,
                    userId
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

export async function getThemeFormationForDropDown({lang, formation,userId }: {lang:string,formation:string, userId?:string  }): Promise<ThemeFormationReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/formation/${formation}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                  userId
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

export async function sendInvitations({themeId, subject, content, lang, participant }: {themeId:string, subject:string, content:string, lang:string, participant:boolean}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${themeId}/invitation`,
            {subject,content,participant},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating Formation:', error);
        throw error;
    }
}


export async function getTargetedUsers({
    themeId,
    page,
    lang,
    familleMetier,
    poste,
    structure,
    service,
    nom,
    prenom,
    search
}: {
    themeId: string;
    page?: number;
    lang: string;
    familleMetier?: string;
    poste?: string;
    structure?: string;
    service?: string;
    nom?: string;
    prenom?: string;
    search?: string;
}): Promise<UtilisateurReturnGetType> {
    const pageSize: number = 20;
    const pageNum: number = page || 1;

    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${themeId}/targeted-users`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language': lang,
                    'authorization': token,
                },
                params: {
                    page: pageNum,
                    limit: pageSize,
                    familleMetier,
                    poste,
                    structure,
                    service,
                    nom,
                    prenom,
                    search,
                },
            },
        );

        // Extraction des données de la réponse
        const targetedUsers: UtilisateurReturnGetType = response.data.data;
        
        return targetedUsers;
    } catch (error) {
        console.error('Error getting targeted users:', error);
        throw error;
    }
}

export async function getThemeById({themeId, lang }: {themeId: string, lang:string}): Promise<ThemeFormation> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const themeFormations: ThemeFormation = response.data.data;
        
        return themeFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}





