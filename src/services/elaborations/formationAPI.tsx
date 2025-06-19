import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/formations`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createFormation({titreFr, titreEn, descriptionFr, descriptionEn, axeStrategique, programmeFormation }: Formation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {titreFr, titreEn, descriptionFr, descriptionEn, axeStrategique, programmeFormation },
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
        console.error('Error creating Formation:', error);
        throw error;
    }
}

export async function updateFormation({ _id, titreFr, titreEn, descriptionFr, descriptionEn, familleMetier, axeStrategique, programmeFormation }: Formation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {titreFr, titreEn, descriptionFr, descriptionEn, familleMetier, axeStrategique, programmeFormation },
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
        console.error('Error updating Formation:', error);
        throw error;
    }
}

export async function deleteFormation(formationId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${formationId}`,
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
        console.error('Error deleting Formation:', error);
        throw error;
    }
}

export async function getFilteredFormations({page, lang, familleMetier, axeStrategique, dateDebut, dateFin, search }: {page: number, lang:string, familleMetier?:string, axeStrategique?:string, dateDebut?:string, dateFin?:string, search?:string }): Promise<FormationReturnGetType> {
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
                    axeStrategique,
                    debut:dateDebut, 
                    fin:dateFin, 
                    titre:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const Formations: FormationReturnGetType = response.data.data;
        
        return Formations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}



export async function getFormationsByFamilleMetier({page, familleMetierId, lang }: {page:number, familleMetierId: string, lang:string }): Promise<FormationReturnGetType> {
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
        const Formations: FormationReturnGetType = response.data.data;
        
        return Formations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

