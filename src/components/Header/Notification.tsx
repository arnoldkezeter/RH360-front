import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bell, Check, Trash2, X, Loader2 } from 'lucide-react';
import { deleteNotification, loadNotifications, markAllAsRead, markAsRead } from '../../services/notifications/notificationServiceAPI';
import { apiUrl, wstjqer } from '../../config';
import { useTranslation } from 'react-i18next';
import socketService from '../../utils/socket';

const NotificationSystem: React.FC<NotificationSystemProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation();

    const token = useMemo(() => localStorage.getItem(wstjqer) || '', []);
    const socketUrl = useMemo(() => apiUrl.replace('/api/v1', ''), []);
    
    // Toast simulé
    const showToast = useCallback((notification: Notification): void => {
        // console.log('📬 Nouvelle notification TOAST:', notification.titre.fr);
        // Intégrez votre système de toast ici (ex: react-toastify)
    }, []);

    // Son de notification
    const playNotificationSound = useCallback((): void => {
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch((e) => console.log('Erreur lecture son:', e));
        } catch (e) {
            console.log('Erreur création Audio:', e);
        }
    }, []);

    // Chargement des notifications
    const loadNotificationsData = useCallback(async (): Promise<void> => {
        if (!userId) return;

        setLoading(true);
        try {
            const result = await loadNotifications(20, 1, false, userId); 
            // console.log('📥 Notifications chargées:', result);
            if (result.success) {
                setNotifications(result.data.notifications);
                setUnreadCount(result.data.nonLuesCount);
            }
        } catch (error) {
            // console.error('❌ Erreur chargement notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]); 

    // Charger les notifications au montage
    useEffect(() => {
        loadNotificationsData();
    }, [loadNotificationsData]);

    // ✅ CORRECTION : Initialisation Socket.IO avec la Solution 2
    useEffect(() => {
        if (!userId || !token) {
            // console.log('⏳ Attente des informations utilisateur...');
            return;
        }

        // console.log('=== INITIALISATION SOCKET NOTIFICATIONS ===');
        // console.log('userId:', userId);
        // console.log('socketUrl:', socketUrl);
        // console.log('token présent:', !!token);
        // console.log('=========================================');

        // Connexion au socket
        socketService.connect(socketUrl, userId, token);

        return () => {
            // console.log('🔌 Déconnexion socket notifications');
            socketService.disconnect();
        };
    }, [userId, token, socketUrl]);

    // ✅ CORRECTION : Écoute des nouvelles notifications
    useEffect(() => {
        if (!userId || !socketService.isConnected()) {
            // console.log('⏸️ Socket non connecté pour les notifications');
            return;
        }

        // console.log('👂 Écoute des notifications pour userId:', userId);

        const handleNewNotification = (notif: Notification) => {
            // console.log('=====================================');
            // console.log('📬 [FRONTEND] Nouvelle notification reçue');
            // console.log('Notification:', notif);
            // console.log('=====================================');
            
            setNotifications(prev => [notif, ...prev]);
            setUnreadCount(prev => prev + 1);
            showToast(notif);
            playNotificationSound();
        };

        // ✅ Utiliser directement socketService
        socketService.onNewNotification(handleNewNotification);

        return () => {
            // console.log('🧹 Nettoyage listener notifications');
            socketService.off('nouvelle_notification', handleNewNotification);
        };
    }, [userId, showToast, playNotificationSound]);

    // Marquer comme lue
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
            console.error('❌ Erreur marquage notification:', error);
        }
    }, [userId]);

    // Marquer toutes comme lues
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
            console.error('❌ Erreur marquage toutes notifications:', error);
        }
    }, [userId]);

    // Supprimer une notification
    const handleDeleteNotification = useCallback(async (notificationId: string): Promise<void> => {
        try {
            const notification = notifications.find((n) => (n._id || n.id) === notificationId); 
            const result = await deleteNotification(notificationId, userId);
            
            if (result.success) {
                setNotifications((prev) => prev.filter((notif) => (notif._id || notif.id) !== notificationId));
                
                if (notification && !notification.lue) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('❌ Erreur suppression notification:', error);
        }
    }, [notifications, userId]);

    // Formatage de la date
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

    // Style selon le type
    const getNotificationStyle = (type: string): string => {
        switch (type) {
            case 'TACHE_STATUT_CHANGE':
                return 'bg-[#E3F2FD] border-[#BBDEFB]';
            case 'TACHE_EXECUTEE':
                return 'bg-[#E8F5E9] border-[#C8E6C9]';
            case 'TACHE_EN_RETARD':
                return 'bg-[#FFEBEE] border-[#FFCDD2]';
            default:
                return 'bg-[#F5F5F5] border-[#E0E0E0]';
        }
    };

    return (
        <div className="relative">
            {/* Bouton notification */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4C51BF] hover:bg-[#F3F4F6]"
            >
                <Bell className="w-6 h-6 text-[#4A5568]" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-semibold text-white transform translate-x-1/4 -translate-y-1/4 bg-[#E53E3E] rounded-full ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panneau des notifications */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

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
                                            }`}
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
                                                                onClick={() => handleMarkAsRead(notification._id || notification.id)} 
                                                                className="p-1 hover:bg-[#EBF8FF] rounded-full text-[#3182CE]"
                                                                title={t('action.marquer_lu')}
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteNotification(notification._id || notification.id)}
                                                            className="p-1 hover:bg-[#FFF5F5] rounded-full text-[#E53E3E]"
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