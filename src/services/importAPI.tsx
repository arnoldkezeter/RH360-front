import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';

const api = `${apiUrl}/import-export-data`;

const getToken = () => `Bearer ${localStorage.getItem(wstjqer)}`;


export async function importerPersonnelExcel(
  fichier: File,
  lang: string
): Promise<ResultatImport> {
  const formData = new FormData();
  formData.append('fichier', fichier);

  const response: AxiosResponse<ResultatImport> = await axios.post(
    `${api}/personnel`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept-language': lang,
        'authorization': getToken(),
      },
    }
  );

  return response.data;
}