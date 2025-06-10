import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../../config';


const api = `${apiUrl}/user`;
const token = localStorage.getItem(wstjqer);




export async function apiDeletePhotoProfil({ userId }: { userId: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/delete-photo-profile?userId=${userId}`,
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
