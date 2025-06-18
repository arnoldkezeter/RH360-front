import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/programmes-de-formation`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createProgrammeFormation({annee, titreFr, titreEn, creePar}: ProgrammeFormation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {annee, titreFr, titreEn, creePar},
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
        console.error('Error creating programmeformation:', error);
        throw error;
    }
}

export async function updateProgrammeFormation({ _id, annee, titreFr, titreEn, creePar }: ProgrammeFormation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {annee, titreFr, titreEn, creePar},
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
        console.error('Error updating programmeformation:', error);
        throw error;
    }
}

export async function deleteProgrammeFormation(programmeformationId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${programmeformationId}`,
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
        console.error('Error deleting programmeformation:', error);
        throw error;
    }
}

export async function getProgrammeFormations({page, lang }: {page: number, lang:string }): Promise<ProgrammeFormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/programmes/stats`,
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
        const programmeFormations: ProgrammeFormationReturnGetType = response.data.data;
        
        return programmeFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getProgrammeFormation({id, lang }: {id: string, lang:string }): Promise<ProgrammeFormationReturnGetType> {
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
        const programmeformations: ProgrammeFormationReturnGetType = response.data.data;
        
        return programmeformations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getRepartitionFormationsParProgramme(): Promise<RepartitionProgramme[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/formations/repartition-par-programme`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        return response.data.data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getNombreProgrammesActifs (): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/programmes/actifs/total`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        return response.data.data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getPourcentageExecutionProgrammes (): Promise<number> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/programmes/pourcentage-execution-global`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        return response.data.data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


