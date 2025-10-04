import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import FilterList from '../../ui/AutoComplete';
import { setShowModal } from '../../../_redux/features/setting';
import { createChat } from '../../../services/executions/chatAPI';
import { createChatSlice } from '../../../_redux/features/execution/chatSlice';

const ENTITY_TYPES = ['TacheExecutee', 'Project', 'Order', 'Support'];
const CHAT_TYPES = ['general', 'private', 'group'];
function FormCreateChat({ currentUser, entityId }: { currentUser: Utilisateur | null, entityId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const [newChatData, setNewChatData] = useState({
        entityType: 'TacheExecutee',
        entityId: entityId,
        title: '',
        chatType: 'general',
        participants: [{
            userId: currentUser?._id||"",
            nom: currentUser?.nom||"",
            prenom:currentUser?.prenom||"",
            email: currentUser?.email||"",
            role: currentUser?.role?.toLowerCase()||"",
            permissions: {
                canAddParticipants: true,
                canRemoveParticipants: true,
                canSendMessages: true
            }
        }] 
    });
    useEffect(() => {
        setModalTitle(t('label.cree_chat'));
        


        if (isFirstRender) {
            
            setIsFirstRender(false);
        }
    }, [isFirstRender, t]);

    const closeModal = () => {
        setNewChatData({
            entityType: 'TacheExecutee',
            entityId: entityId,
            title: '',
            chatType: 'general',
            participants: [{
                userId: currentUser?._id||"",
                nom: currentUser?.nom||"",
                prenom:currentUser?.prenom||"",
                email: currentUser?.email||"",
                role: currentUser?.role?.toLowerCase()||"",
                permissions: {
                    canAddParticipants: true,
                    canRemoveParticipants: true,
                    canSendMessages: true
                }
            }] 
        })
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

  


    


    const handleCreateChat = async () => {
        if (!newChatData.chatType || !newChatData.entityType) {
            
            return;
        }

        const newChat: Chat = {entityType: newChatData.entityType, entityId: entityId, createdBy: currentUser?._id||"", title: newChatData.title, chatType: newChatData.chatType, participants: newChatData.participants, messages: [], isActive: true, lastActivity: new Date().toISOString() };
        await createChat(newChat, lang).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message, '', 0);
                dispatch(createChatSlice({
    
                    chat: {
                        _id: e.data._id,
                        entityType: e.data.entityType,
                        entityId: e.data.entityId,
                        createdBy: e.data.createdBy,
                        title:e.data.title,
                        chatType: e.data.chatType,
                        participants: e.data.participants,
                        messages: e.data.messages,
                        isActive: e.data.isActive,
                        lastActivity: e.data.lastActivity
                    }
    
                }));
    
                closeModal()
            } else {
                createToast(e.message, '', 2);
            }
        }).catch((e) => {
            createToast(e.response.data.message, '', 2);
        })
       

    }

    
    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateChat}
            >     
                        
                <label >{t("label.type_entite")}</label>
                <select 
                    value={newChatData.entityType} 
                    onChange={(e) => setNewChatData(prev => ({ ...prev, entityType: e.target.value as typeof prev.entityType }))} 
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                        {ENTITY_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
                {/* <label >ID de l'entité</label><input type="text" value={newChatData.entityId} onChange={(e) => setNewChatData(prev => ({ ...prev, entityId: e.target.value }))} className="w-full px-3 py-2 border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6]" placeholder="507f1f77bcf86cd799439011" /> */}
                <label>{t("label.titre_chat")}</label>
                <input 
                    type="text" value={newChatData.title} 
                    onChange={(e) => setNewChatData(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary" 
                    placeholder="Titre optionnel" />
                <label>Type de chat</label>
                <select 
                    value={newChatData.chatType} 
                    onChange={(e) => setNewChatData(prev => ({ ...prev, chatType: e.target.value as typeof prev.chatType }))} 
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                        {CHAT_TYPES.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
                   
            </CustomDialogModal>

        </>
    );
}



export default FormCreateChat;
