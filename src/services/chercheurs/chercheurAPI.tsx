import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/chercheurs`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createChercheur({nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, etablissement, domaineRecherche, photoDeProfil, commune, actif}: Chercheur, lang:string): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, domaineRecherche, etablissement, photoDeProfil, commune, actif},
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
        console.error('Error creating chercheur:', error);
        throw error;
    }
}

export async function updateChercheur({ _id,nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, etablissement, domaineRecherche, photoDeProfil, commune, actif }: Chercheur, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nom, prenom, email, genre, telephone, dateNaissance, lieuNaissance, etablissement, domaineRecherche, photoDeProfil, commune, actif},
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
        console.error('Error updating chercheur:', error);
        throw error;
    }
}

export async function deleteChercheur(chercheurId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${chercheurId}`,
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
        console.error('Error deleting chercheur:', error);
        throw error;
    }
}

export async function getChercheurs({page, lang }: {page: number, lang:string }): Promise<ChercheurReturnGetType> {
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
        const chercheurs: ChercheurReturnGetType = response.data.data;
        
        return chercheurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getChercheur({id, lang }: {id: string, lang:string }): Promise<ChercheurReturnGetType> {
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
        const chercheurs: ChercheurReturnGetType = response.data.data;
        
        return chercheurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchChercheur({ searchString, lang }: { lang:string, searchString: string}): Promise<ChercheurReturnGetType> {
   
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
        const chercheurs: ChercheurReturnGetType = response.data.data;

        return chercheurs;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getChercheurForDropDown({lang }: {lang:string }): Promise<ChercheurReturnGetType> {
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
        const chercheur: ChercheurReturnGetType = response.data.data;
        
        return chercheur;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getChercheursByFiltres({page,etablissement, statut, search, lang }: {page:number, etablissement?:string, statut?:string, search?:string, lang:string }): Promise<ChercheurReturnGetType> {
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
                    etablissement:etablissement,
                    statut:statut,
                    search:search
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Chercheurs: ChercheurReturnGetType = response.data.data;
        
        return Chercheurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCurrentUserData({ userId }: { userId: string }): Promise<Chercheur> {
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
        const data: Chercheur = response.data.data;
        return data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}
