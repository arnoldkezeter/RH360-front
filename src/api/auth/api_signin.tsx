import axios, { AxiosError } from 'axios';
import { storeTokenInLocalStorage } from '../../middlewares/auth_middleware.js';
import { apiUrl } from './../../config.js'

const api = `${apiUrl}`;

interface ApiResponse<T> {
    success: boolean;
    data?: any;
    message?: string | null;
    token?: string;
}

interface SignInApiResponse {
    success: boolean;
    message: any;
    token?: string;
    utilisateur?: any; // Adapter cette interface en fonction de la structure de données de l'utilisateur
}

interface SignInApiProps {
    email: string;
    motDePasse: string;
    lang:string;
}

export async function signInApi({ email, motDePasse, lang }: SignInApiProps): Promise<ApiResponse<string>> {
    try {
        const response = await axios.post<SignInApiResponse>(
            `${api}/auth/login`,
            { email, motDePasse },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'lang':lang,
                },
            },
        );

        const data = response.data;        
        if (data.utilisateur.role) {
            if (data.token) {
                storeTokenInLocalStorage(data.token);
                return {
                    success: data.success,
                    message: data.message,
                    token: data.token,
                    data: data.utilisateur,
                };
            }

        }
        return {
            success: data.success,
            data: data.utilisateur,
            message: undefined,

        };



    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const axiosError: AxiosError<ApiResponse<string>> = error;

            if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
                return { success: false, message: axiosError.response.data?.message || 'Erreur inconnue' };
            }
        }

        throw error;
    }
}
