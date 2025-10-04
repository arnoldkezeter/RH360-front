import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bell, Check, Trash2, X, Loader2 } from 'lucide-react';
import { deleteNotification, loadNotifications, markAllAsRead, markAsRead } from '../../services/notifications/notificationServiceAPI';
import { apiUrl, config, wstjqer } from '../../config';
import { useTranslation } from 'react-i18next';
import socket from '../../utils/socket';
import { useSocket } from '../../hooks/useSocket';

// --- Déclaration d'interface pour la clarté TypeScript ---
// Assurez-vous que cette interface correspond à la structure de vos données backend


const NotificationSystem: React.FC<NotificationSystemProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    // Utilisation de useMemo pour le token, car il ne change que si userId change
    const token = useMemo(() => `Bearer ${localStorage.getItem(wstjqer)}`, [wstjqer]);
    
    // --- Fonctions de base (facteur commun dans useEffect) ---
    // useCallback pour stabiliser ces fonctions si elles sont des dépendances
    
    // Simuler le Toast (utilisez votre librairie de toast réelle ici)
    const showToast = useCallback((notification: Notification): void => {
        // Ex: toast.info(notification.titre.fr);
        console.log('Nouvelle notification TOAST:', notification.titre.fr);
    }, []);

    // Simuler le son (peut-être éviter la recréation de l'objet audio si possible)
    const playNotificationSound = useCallback((): void => {
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch((e) => console.log('Erreur lecture son:', e));
        } catch (e) {
            console.log('Erreur lors de la création de l\'objet Audio:', e);
        }
    }, []);
    // -----------------------------------------------------


    // --- Logique d'appel API pour charger les notifications ---
    const loadNotificationsData = useCallback(async (): Promise<void> => {
        if (!userId) return; // Ne charge rien si l'ID n'est pas prêt

        setLoading(true);
        try {
            // Utilisation des valeurs hardcodées (20, 1, false) comme dans votre code original
            const result = await loadNotifications(20, 1, false, userId); 
            console.log(result)
            if (result.success) {
                setNotifications(result.data.notifications);
                setUnreadCount(result.data.nonLuesCount);
            }
        } catch (error) {
            console.error('Erreur chargement notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]); 

    // Charger les notifications au montage OU lorsque l'userId devient disponible
    useEffect(() => {
        loadNotificationsData();
    }, [loadNotificationsData]);
    useEffect(() => {
        if (!userId || !userId) {
            console.log('⏳ Attente du chargement utilisateur...');
            // Vous pouvez afficher un loader ici
        }
    }, [userId]);
    console.log('=== DEBUG SOCKET ===');
    // console.log('currentUser:', currentUser);
    console.log('userId:', userId);
    console.log('token:', token);
    console.log('wstjqer:', wstjqer);
    console.log('apiUrl:', apiUrl);
    console.log('==================');

    const socket = useSocket({
        apiUrl,
        userId,
        token,
        enabled: !!userId
    });
    // --- Connexion et Authentification Socket.IO ---
       useEffect(() => {
        if (!userId) return;

        const handleNewNotification = (notif: Notification) => {
            console.log('📬 Nouvelle notification reçue:', notif);
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            showToast(notif);
            playNotificationSound();
        };

        socket.onNewNotification(handleNewNotification);

        return () => {
            socket.off('nouvelle_notification', handleNewNotification);
        };
    }, [userId]);




    // --- Handlers d'action ---

    const handleMarkAsRead = useCallback(async (notificationId: string): Promise<void> => {
        try {
            const result = await markAsRead(notificationId, userId);
            
            if (result.success) {
                setNotifications((prev) =>
                    prev.map((notif) =>
                        (notif._id || notif.id) === notificationId ? { ...notif, lue: true } : notif
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Erreur marquage notification:', error);
        }
    }, [userId]);

    const handleMarkAllAsRead = useCallback(async (): Promise<void> => {
        try {
            const result = await markAllAsRead(userId);
            
            if (result.success) {
                setNotifications((prev) =>
                    prev.map((notif) => ({ ...notif, lue: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Erreur marquage toutes notifications:', error);
        }
    }, [userId]);

    const handleDeleteNotification = useCallback(async (notificationId: string): Promise<void> => {
        try {
            // Assurez-vous d'utiliser _id ou id selon votre structure
            const notification = notifications.find((n) => (n._id || n.id) === notificationId); 
            const result = await deleteNotification(notificationId, userId);
            
            if (result.success) {
                setNotifications((prev) => prev.filter((notif) => (notif._id || notif.id) !== notificationId));
                
                if (notification && !notification.lue) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Erreur suppression notification:', error);
        }
    }, [notifications, userId]);


    // --- Fonctions utilitaires de rendu ---

    const formatDate = (date: string): string => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now.getTime() - notifDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('label.a_l_instant');
        if (diffMins < 60) return t('label.il_y_a_min', { count: diffMins });
        if (diffHours < 24) return t('label.il_y_a_h', { count: diffHours });
        if (diffDays < 7) return t('label.il_y_a_j', { count: diffDays });
        return notifDate.toLocaleDateString('fr-FR');
    };

    // Utilisation de couleurs hexadécimales et de tons plus doux
    const getNotificationStyle = (type: string): string => {
        switch (type) {
            case 'TACHE_STATUT_CHANGE':
                return 'bg-[#E3F2FD] border-[#BBDEFB]'; // Bleu doux
            case 'TACHE_EXECUTEE':
                return 'bg-[#E8F5E9] border-[#C8E6C9]'; // Vert doux
            case 'TACHE_EN_RETARD':
                return 'bg-[#FFEBEE] border-[#FFCDD2]'; // Rouge doux
            default:
                return 'bg-[#F5F5F5] border-[#E0E0E0]'; // Gris très clair
        }
    };


    return (
        <div className="relative">
            {/* Bouton notification */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4C51BF] hover:bg-[#F3F4F6]" // Bleu indigo pour focus
            >
                <Bell className="w-6 h-6 text-[#4A5568]" /> {/* Gris foncé */}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-semibold text-white transform translate-x-1/4 -translate-y-1/4 bg-[#E53E3E] rounded-full ring-2 ring-white"> {/* Rouge vif */}
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panneau des notifications */}
            {isOpen && (
                <>
                    {/* Overlay pour fermer en cliquant à l'extérieur */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl z-50 max-h-[70vh] flex flex-col border border-[#E2E8F0]">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#F1F1F1] sticky top-0 bg-white z-10 rounded-t-xl">
                            <h3 className="text-xl font-bold text-[#2D3748]">
                                {t('label.notifications')}
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-sm text-[#4C51BF] hover:text-[#383C85] font-semibold transition-colors"
                                        disabled={loading}
                                    >
                                        {t('label.tous_marquer_lu')}
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 text-[#718096] hover:bg-[#F3F4F6] rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Liste des notifications */}
                        <div className="flex-1 overflow-y-auto">
                            {loading && notifications.length === 0 ? (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="w-6 h-6 text-[#4C51BF] animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-[#A0AEC0]">
                                    <Bell className="w-12 h-12 mb-4 text-[#E2E8F0]" />
                                    <p className="text-center">{t('label.aucune_notification')}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#EDF2F7]">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id || notification.id}
                                            className={`p-4 transition-colors duration-150 flex items-start gap-3 ${
                                                !notification.lue ? 'bg-[#F7FAFC]' : 'hover:bg-[#F7FAFC]'
                                            }`} // L'arrière-plan du non-lu est plus subtil
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm mb-1 ${!notification.lue ? 'font-semibold text-[#2D3748]' : 'text-[#4A5568]'}`}>
                                                    {notification.titre.fr}
                                                </p>
                                                <p className="text-sm text-[#718096] mb-2">
                                                    {notification.message.fr}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-[#A0AEC0]">
                                                        {formatDate(notification.dateCreation)}
                                                    </p>
                                                    
                                                    <div className="flex items-center gap-1">
                                                        {!notification.lue && (
                                                            <button
                                                                // Utilisation de notification._id car c'est la clé de MongoDB
                                                                onClick={() => handleMarkAsRead(notification._id || notification.id)} 
                                                                className="p-1 hover:bg-[#EBF8FF] rounded-full text-[#3182CE]" // Bleu plus vif
                                                                title={t('action.marquer_lu')}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteNotification(notification._id || notification.id)}
                                                            className="p-1 hover:bg-[#FFF5F5] rounded-full text-[#E53E3E]" // Rouge pour suppression
                                                            title={t('action.supprimer')}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationSystem;