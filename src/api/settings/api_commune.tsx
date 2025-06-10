import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateCommune({ code, departement, libelleFr, libelleEn }: CommuneProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/commune/create`,
            { code, departement, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating commune:', error);
        throw error;
    }
}

export async function apiUpdateCommune({ _id, code, libelleFr, libelleEn, departement }: CommuneProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/commune/update/${_id}`,
            { code, libelleFr, libelleEn, departement },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating region:', error);
        throw error;
    }
}

export async function apiDeleteCommune(communeId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/commune/delete/${communeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting region:', error);
        throw error;
    }
}
