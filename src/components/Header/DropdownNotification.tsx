import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';

// import { removeNotifications, removeNotification, setNewNotification } from '../../_redux/features/notification_slice';
import { markAllNotificationAsRead, markNotificationAsRead } from '../../services/api_notification';
import { config } from '../../config';


interface NotificationProps {
    onEdit: (notification: NotificationType) => void;
}
const DropdownNotification = ({ onEdit }: NotificationProps) => {
    // const notifications: NotificationType[] = useSelector((state: RootState) => state.notifications.data);
    // const sortedNotifications = [...notifications].sort((a, b) => {
    //     const dateA = new Date(a.date_creation).getTime();
    //     const dateB = new Date(b.date_creation).getTime();
    //     return dateB - dateA;
    // });
    // const newNotification = useSelector((state: RootState) => state.notifications.newNotification);

    // const [dropdownOpen, setDropdownOpen] = useState(false);

    // const trigger = useRef<any>(null);
    // const dropdown = useRef<any>(null);
    // const lang = useSelector((state: RootState) => state.setting.language);

    // useEffect(() => {
    //     const clickHandler = ({ target }: MouseEvent) => {
    //         if (!dropdown.current) return;
    //         if (
    //             !dropdownOpen ||
    //             dropdown.current.contains(target) ||
    //             trigger.current.contains(target)
    //         )
    //             return;
    //         setDropdownOpen(false);
    //     };
    //     document.addEventListener('click', clickHandler);
    //     return () => document.removeEventListener('click', clickHandler);
    // });

    // useEffect(() => {
    //     const keyHandler = ({ keyCode }: KeyboardEvent) => {
    //         if (!dropdownOpen || keyCode !== 27) return;
    //         setDropdownOpen(false);
    //     };
    //     document.addEventListener('keydown', keyHandler);
    //     return () => document.removeEventListener('keydown', keyHandler);
    // });

    // const { t } = useTranslation();
    // const dispatch = useDispatch();
    // const currentUser: UserState = useSelector((state: RootState) => state.user);

    // const markAllAsRead = async (notifications: NotificationType[]) => {
    //     const notificationIds = notifications.map(n => n._id);
    //     if (notificationIds.length > 0) {
    //       if(notificationIds){
    //         await markAllNotificationAsRead({ notificationIds, userId: currentUser._id }).then((response) => {
    //             if (response.success) {
    //                 dispatch(removeNotifications(notificationIds));
    //             }
    //         });}
    //     }
    // };

    // const markAsRead = async (notificationId: string) => {
    //     await markNotificationAsRead({ notificationId, userId: currentUser._id }).then((response) => {
    //         if (response.success) {
    //             dispatch(removeNotification(notificationId));
    //         }
    //     });
    // };

    return (
        <li className="relative">
            <Link
                // ref={trigger}
                // onClick={() => { setDropdownOpen(!dropdownOpen); dispatch(setNewNotification(false)) }}
                to="#"
                
            >
                {
                    // newNotification &&
                    <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
                        <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                    </span>
                }

                <svg
                    className="fill-current text-white duration-300 ease-in-out"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
                        fill=""
                    />
                </svg>
            </Link>

            {/* <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute -right-27 mt-2.5 flex overflow-auto min-h-[150px] max-h-[500px] w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${dropdownOpen === true ? 'block' : 'hidden'
                    } custom-scrollbar`}
            >
                <div className="px-4.5 py-3 flex justify-between items-center">
                    <h5 className="text-sm font-medium text-bodydark2">{t('label.notifications')}</h5>
                    {sortedNotifications.length > 0 && (
                        <button onClick={() => markAllAsRead(sortedNotifications)} className="text-xs text-primary">
                            {t('label.marquer_tous_lu')}
                        </button>
                    )}
                </div>

                {sortedNotifications.length === 0 ? (
                    <p className="text-sm mx-4 mt-8">
                        <span className="text-black dark:text-white">
                            {t('tableau_de_bord.aucune_alerte')}
                        </span>{' '}
                    </p>
                ) : (
                    <div className="overflow-y-auto max-h-[300px] custom-scrollbar">
                        {sortedNotifications.slice(0, 5).map((notification) => {
                            const formattedDate = new Date(notification.date_creation).toLocaleString(lang);

                            return (
                                <ul className="flex h-auto flex-col overflow-y-auto" key={notification._id}>
                                    <li>
                                        <div className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                                            <div className="text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-bold text-black dark:text-white">
                                                        {notification.user.nom} {notification.user.prenom}
                                                    </span>
                                                    <button onClick={() => {notification && notification._id && markAsRead(notification._id)}} className="text-xs text-primary">
                                                        {t('label.marquer_lu')}
                                                    </button>
                                                </div>
                                                <span onClick={()=> {notification._id && markAsRead(notification._id); onEdit(notification)}}>
                                                    <p className="text-[14px] font-medium cursor-pointer" >
                                                       
                                                    </p>
                                                    <p className="text-right cursor-pointer">
                                                        {formattedDate}
                                                    </p>
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            );
                        })}
                    </div>
                )}
            </div> */}
        </li>
    );
};

export default DropdownNotification;
