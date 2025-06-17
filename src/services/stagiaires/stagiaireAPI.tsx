import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/stagiaires`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createStagiaire({nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, photoDeProfil, commune, parcours, actif}: Stagiaire, lang:string): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, photoDeProfil, commune, parcours, actif},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );
        console.log(response.data)
        return response.data;

    } catch (error) {
        console.error('Error creating stagiaire:', error);
        throw error;
    }
}

export async function updateStagiaire({ _id,nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, photoDeProfil, commune, parcours, actif }: Stagiaire, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, photoDeProfil, commune, parcours, actif},
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
        console.error('Error updating stagiaire:', error);
        throw error;
    }
}

export async function deleteStagiaire(stagiaireId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${stagiaireId}`,
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
        console.error('Error deleting stagiaire:', error);
        throw error;
    }
}

export async function getStagiaires({page, lang }: {page: number, lang:string }): Promise<StagiaireReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const stagiaires: StagiaireReturnGetType = response.data.data;
        
        return stagiaires;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getStagiaire({id, lang }: {id: string, lang:string }): Promise<StagiaireReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const stagiaires: StagiaireReturnGetType = response.data.data;
        
        return stagiaires;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchStagiaire({ searchString, lang }: { lang:string, searchString: string}): Promise<StagiaireReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/search/by-name`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    nom:searchString
                }
            },
        );
        const stagiaires: StagiaireReturnGetType = response.data.data;

        return stagiaires;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getStagiaireForDropDown({lang }: {lang:string }): Promise<StagiaireReturnGetType> {
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
        const stagiaire: StagiaireReturnGetType = response.data.data;
        
        return stagiaire;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getStagiairesByFiltres({page, dateDebut, dateFin, service, etablissement, statut, lang, search }: {page:number, dateDebut?:string, dateFin?:string, service?:string, etablissement?:string, statut?:string, search?:string, lang:string }): Promise<StagiaireReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    page:page,
                    limit:pageSize,
                    serviceId:service,
                    dateDebut:dateDebut, 
                    dateFin:dateFin, 
                    etablissement:etablissement,
                    statut:statut,
                    search:search
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Stagiaires: StagiaireReturnGetType = response.data.data;
        
        return Stagiaires;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCurrentUserData({ userId }: { userId: string }): Promise<Stagiaire> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const data: Stagiaire = response.data.data;
        return data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
