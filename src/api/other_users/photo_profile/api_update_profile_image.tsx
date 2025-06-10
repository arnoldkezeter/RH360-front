import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../../config';


const api = `${apiUrl}/user`;
const token = localStorage.getItem(wstjqer);




export async function apiUpdatePhotoProfil({ formData, userId }: { formData: FormData, userId: string }): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/save-photo-profile?userId=${userId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/json',
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
