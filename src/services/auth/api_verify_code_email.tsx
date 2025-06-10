import axios, { AxiosResponse } from "axios";
import { apiUrl, wstjqer } from '../../config.js'

const api = `${apiUrl}/auth`;
const token = localStorage.getItem(wstjqer);

interface VerifyCodeSendByEmail {
    userId: string;
    code: string;
}


export async function apiVerifyCodeSendByEmail({ userId, code }: VerifyCodeSendByEmail): Promise<ReponseApiPros> {

    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/password/verification/verify`,
            { userId, code },
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