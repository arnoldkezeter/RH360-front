import axios, { AxiosResponse } from "axios";
import { apiUrl, wstjqer } from '../../config.js'

const api = `${apiUrl}/auth`;
const token = localStorage.getItem(wstjqer);

interface ResetPassApiProps {
    email: string;
}


export async function apiSendVerificationCodeByEmail({ email }: ResetPassApiProps): Promise<ReponseApiPros> {

    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/password/verification/send`,
            { email },
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