import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/utilisateurs`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createUtilisateur({ matricule, nom, prenom, email, genre, role, telephone, dateNaissance, lieuNaissance, dateEntreeEnService, photoDeProfil, service, categorieProfessionnelle, posteDeTravail, commune, grade, familleMetier, actif}: Utilisateur, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {matricule, nom, prenom, email, genre, role, telephone, dateNaissance, lieuNaissance, dateEntreeEnService, photoDeProfil, service, categorieProfessionnelle, posteDeTravail, commune, grade, familleMetier, actif},
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
        console.error('Error creating utilisateur:', error);
        throw error;
    }
}

export async function updateUtilisateur({ _id,matricule, nom, prenom, email, genre, role, telephone, dateNaissance, lieuNaissance, dateEntreeEnService, photoDeProfil, service, categorieProfessionnelle, posteDeTravail, commune, grade, familleMetier, actif }: Utilisateur, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {matricule, nom, prenom, email, genre, role, telephone, dateNaissance, lieuNaissance, dateEntreeEnService, photoDeProfil, service, categorieProfessionnelle, posteDeTravail, commune, grade, familleMetier, actif },
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
        console.error('Error updating utilisateur:', error);
        throw error;
    }
}

export async function deleteUtilisateur(utilisateurId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${utilisateurId}`,
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
        console.error('Error deleting utilisateur:', error);
        throw error;
    }
}

export async function getUtilisateurs({page, lang }: {page: number, lang:string }): Promise<UtilisateurReturnGetType> {
    const pageSize: number = 20;
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
        const utilisateurs: UtilisateurReturnGetType = response.data.data;
        
        return utilisateurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getUtilisateur({id, lang }: {id: string, lang:string }): Promise<UtilisateurReturnGetType> {
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
        const utilisateurs: UtilisateurReturnGetType = response.data.data;
        
        return utilisateurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchUtilisateur({ searchString, lang }: { lang:string, searchString: string}): Promise<UtilisateurReturnGetType> {
   
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
        const utilisateurs: UtilisateurReturnGetType = response.data.data;

        return utilisateurs;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getUtilisateurForDropDown({lang }: {lang:string }): Promise<UtilisateurReturnGetType> {
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
        const utilisateur: UtilisateurReturnGetType = response.data.data;
        
        return utilisateur;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getUtilisateursByFiltres({page, service, role, lang }: {page:number, role?: string, service?:string, lang:string }): Promise<UtilisateurReturnGetType> {
    const pageSize = 20;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    page:page,
                    limit:pageSize,
                    role:role,
                    service:service
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const utilisateurs: UtilisateurReturnGetType = response.data.data;
        return utilisateurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCurrentUserData({ userId }: { userId: string }): Promise<Utilisateur> {
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
        const data: Utilisateur = response.data.data;
        return data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function savePhotoProfil({ formData, userId }: { formData: FormData, userId: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/save-photo-profil/${userId}`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section : ', error);
        throw error;
    }
}

export async function verifierMotDePasse({ userId, motDePasse }: { userId: String, motDePasse: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/verifier-mot-de-passe/${userId}/${motDePasse}`,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section : ', error);
        throw error;
    }
}

export async function updateMotDePasse({ userId, motDePasse }: { userId: String, motDePasse: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/update-mot-de-passe/${userId}/${motDePasse}`,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section : ', error);
        throw error;
    }
}
