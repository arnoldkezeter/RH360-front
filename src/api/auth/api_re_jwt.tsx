import axios, { AxiosError } from 'axios';
import { storeTokenInLocalStorage } from '../../middlewares/auth_middleware.js';
import { apiUrl } from '../../config.js'

const api = `${apiUrl}`;

interface ApiResponse<T> {
    success: boolean;
    data?: any;
    message: string;
    token?: string;
}

interface SignInApiResponse {
    success: boolean;
    message: string;
    token?: string;
    data?: any; // Adapter cette interface en fonction de la structure de données de l'utilisateur
}

interface Props {
    role: string;
    userId: string;
}

export async function reJwtApi({ role, userId }: Props): Promise<ApiResponse<string>> {
    try {
        const response = await axios.post<SignInApiResponse>(
            `${api}/auth/signin/re-jwt`,
            { role, userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );


        const data = response.data;

        if (data.token) {
            storeTokenInLocalStorage(data.token);
        }

        return {
            success: data.success,
            message: data.message,
            token: data.token,
            data: data.data,
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
