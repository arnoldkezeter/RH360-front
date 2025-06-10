import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';


const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateDepartement({ code, region, libelleFr, libelleEn }: DepartementProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/departement/create`,
            { code, region, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating region:', error);
        throw error;
    }
}

export async function apiUpdateDepartement({ _id, code, libelleFr, libelleEn, region }: DepartementProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/departement/update/${_id}`,
            { code, libelleFr, libelleEn, region },
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

export async function apiDeleteDepartement(departementId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/departement/delete/${departementId}`,
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
