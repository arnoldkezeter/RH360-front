// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import socketService from '../utils/socket';

interface UseSocketProps {
    apiUrl: string;
    userId: string | undefined;
    token: string;
    enabled?: boolean;
}

/**
 * Hook personnalisé pour gérer Socket.IO
 */
export const useSocket = ({ apiUrl, userId, token, enabled = true }: UseSocketProps) => {
    const isInitialized = useRef(false);

    useEffect(() => {
        // Ne connecter que si enabled et que userId/token sont valides
        if (!enabled || !userId || !token) {
            console.log('⏸️ Socket désactivé ou infos manquantes');
            return;
        }

        // Éviter les doubles connexions
        if (isInitialized.current) {
            console.log('✅ Socket déjà initialisé');
            return;
        }

        console.log('🚀 Initialisation Socket.IO...');
        socketService.connect(apiUrl, userId, token);
        isInitialized.current = true;

        // Cleanup à la déconnexion du composant
        return () => {
            if (isInitialized.current) {
                console.log('🔌 Déconnexion Socket.IO');
                socketService.disconnect();
                isInitialized.current = false;
            }
        };
    }, [apiUrl, userId, token, enabled]);

    return socketService;
};