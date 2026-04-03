// services/elaborations/tdrAPI.ts
import axios from "axios";
import { apiUrl, wstjqer } from "../../config";


const api = `${apiUrl}/tdr`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

// ── Prefill ───────────────────────────────────────────────────────────────────

export const getTDRPrefill = async (themeId: string, lang: string = "fr") => {
    const response = await axios.get(`${api}/${themeId}/prefill`, {
        headers: { 
            'Content-Type': 'application/json',
            'accept-language': lang,
            'authorization': token,
        },
    });
    return response.data?.data;
};

// ── Génération PDF ────────────────────────────────────────────────────────────

export const genererTDR = async (
    themeId: string,
    payload: TDRGeneratePayload,
    lang: string = "fr"
): Promise<Blob> => {
    console.log(payload.decoupageHoraire);
    const response = await axios.post(`${api}/${themeId}`, payload, {
        headers: {
            'Content-Type': 'application/json',
            'accept-language': lang,
            'authorization': token,
        },
        responseType: "blob",
    });
    return response.data;
};

// ── Utilitaire : déclencher le téléchargement du PDF ─────────────────────────

export const downloadPDFBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};