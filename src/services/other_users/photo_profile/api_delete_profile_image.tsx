import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../../config';


const api = `${apiUrl}/utilisateurs`;
const token = localStorage.getItem(wstjqer);




export async function apiDeletePhotoProfil({ userId, lang }: { userId: string, lang:string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${userId}/photo-profil`,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating section : ', error);
        throw error;
    }
}
