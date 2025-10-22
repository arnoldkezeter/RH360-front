import axios, { AxiosResponse } from "axios";
import { apiUrl, wstjqer } from '../../config.js'

const api = `${apiUrl}/auth`;
const token = localStorage.getItem(wstjqer);
interface ResetPassApiProps {
    userId: string;
    motDePasse: string;
}


export async function apiVerifierMotDePasse({ userId, motDePasse }: ResetPassApiProps): Promise<ReponseApiPros> {

    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${userId}/verify-password`,
            {motDePasse},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        // console.error('Error updating section:', error);
        throw error;
    }
}