import { jwtDecode } from "jwt-decode";
import { wstjqer } from "../config";

const decodeToken = (token) => {
    if (!token) {
        return {
            value: null,
            status: false,
            error: "Aucun token trouvé.",
        };
    }

    try {
        const decodedToken = jwtDecode(token);
        return {
            value: decodedToken,
            status: true,
        };
    } catch (error) {
        let errorMessage = "Erreur inconnue lors du décodage du token.";

        if (error.name === "SyntaxError") { // Likely malformed JWT
            errorMessage = "Le token est mal formé.";
        } else if (error.message?.includes("expired")) { // Check for expired token
            errorMessage = "Le token a expiré.";
        } else {
            console.error("Erreur de décodage du token :", error); // Log specific error for debugging
        }

        return {
            value: null,
            status: false,
            error: errorMessage,
        };
    }
};

const isUserAuthenticated = async () => {
    const token = localStorage.getItem(wstjqer);

    if (!token) {
        return {
            value: null,
            status: false,
            error: "Aucun token trouvé.",
        };
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken.status) {
        return decodedToken; // Return error details if decoding failed
    }

    const isExpired = decodedToken.value.exp < Date.now() / 1000;

    if (!isExpired) {
        return {
            value: decodedToken.value,
            status: true,
        };
    } else {
        console.warn("JWT est expiré");
        return {
            value: "Votre session a expiré, veuillez vous reconnecter !",
            status: false,
        };
    }
};

const storeTokenInLocalStorage = (token) => {
    try {
        localStorage.removeItem(wstjqer);
        localStorage.setItem(wstjqer, token);

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: "Erreur lors du stockage du token dans le localStorage.",
        };
    }
};

export { isUserAuthenticated, storeTokenInLocalStorage };
