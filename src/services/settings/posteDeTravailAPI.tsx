import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/postes-de-travail`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createPosteDeTravail({nomFr, nomEn, descriptionFr, descriptionEn, famillesMetier, services }: PosteDeTravail, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn, descriptionFr, descriptionEn, famillesMetier, services },
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
        console.error('Error creating PosteDeTravail:', error);
        throw error;
    }
}

export async function updatePosteDeTravail({ _id, nomFr, nomEn, descriptionFr, descriptionEn, famillesMetier, services }: PosteDeTravail, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn, descriptionFr, descriptionEn, famillesMetier, services},
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
        console.error('Error updating PosteDeTravail:', error);
        throw error;
    }
}

export async function deletePosteDeTravail(posteDeTravailId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${posteDeTravailId}`,
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
        console.error('Error deleting PosteDeTravail:', error);
        throw error;
    }
}

export async function getPosteDeTravails({page, lang }: {page: number, lang:string }): Promise<PosteDeTravailReturnGetType> {
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
        const PosteDeTravails: PosteDeTravailReturnGetType = response.data.data;
        
        return PosteDeTravails;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPosteDeTravail({id, lang }: {id: string, lang:string }): Promise<PosteDeTravailReturnGetType> {
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
        const PosteDeTravails: PosteDeTravailReturnGetType = response.data.data;
        
        return PosteDeTravails;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchPosteDeTravail({ searchString, lang }: { lang:string, searchString: string}): Promise<PosteDeTravailReturnGetType> {
   
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
        const PosteDeTravails: PosteDeTravailReturnGetType = response.data.data;

        return PosteDeTravails;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchPosteDeTravailByFamille({familleId, searchString, lang }: {familleId:string, lang:string, searchString: string}): Promise<PosteDeTravailReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/familles-metier/${familleId}/postes`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    search:searchString
                }
            },
        );
        const PosteDeTravails: PosteDeTravailReturnGetType = response.data.data;

        return PosteDeTravails;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPosteDeTravailsByFamilleMetier({page, familleMetierId, lang }: {page:number, familleMetierId: string, lang:string }): Promise<PosteDeTravailReturnGetType> {
    const pageSize = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/famille-metier/${familleMetierId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    page:page,
                    limit:pageSize
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const PosteDeTravails: PosteDeTravailReturnGetType = response.data.data;
        
        return PosteDeTravails;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPosteDeTravailForDropDown({familleMetierId, lang }: {familleMetierId:string, lang:string }): Promise<PosteDeTravailReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/famille-metier/${familleMetierId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const communes: PosteDeTravailReturnGetType = response.data.data;
        
        return communes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

