import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/setting`;

const token = localStorage.getItem(wstjqer);

export async function apiCreateFonction({ code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/fonction/create`,
            { code, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating fonction:', error);
        throw error;
    }
}

export async function apiUpdateFonction({ _id, code, libelleFr, libelleEn }: CommonSettingProps): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/fonction/update/${_id}`,
            { code, libelleFr, libelleEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating fonction:', error);
        throw error;
    }
}

export async function apiDeleteFonction(fonctionId: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/fonction/delete/${fonctionId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting fonction:', error);
        throw error;
    }
}
