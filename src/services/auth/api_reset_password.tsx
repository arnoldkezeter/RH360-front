import axios, { AxiosResponse } from "axios";
import { apiUrl, wstjqer } from '../../config.js'

const api = `${apiUrl}/auth`;
const token = localStorage.getItem(wstjqer);
interface ResetPassApiProps {
    userId: string;
    newPassword: string;
}
export async function apiUpdatePassword({userId, newPassword}: ResetPassApiProps): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/password/update`,
            {userId, newPassword },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        // console.error('Error updating section:', error);
        throw error;
    }
}