import { AlertCircle, BarChart3, Check, CheckSquare, Clock, FileText, Mail, Upload, Users, MessageCircle } from 'lucide-react';
import React from 'react';
import { ETAT_TACHE } from '../../../config';
import { useTranslation } from 'react-i18next';

const StatusIcon = ({ statut }: { statut: string }) => {
  const iconClasses = "w-5 h-5";
  switch (statut) {
    case 'TERMINE':
      return <Check className={`${iconClasses} text-[#22C55E]`} />;
    case 'EN_COURS':
      return <Clock className={`${iconClasses} text-[#F59E0B]`} />;
    default:
      return <AlertCircle className={`${iconClasses} text-[#EF4444]`} />;
  }
};

const TacheTypeIcon = ({ type }: { type: string }) => {
  const iconClasses = "w-4 h-4";
  const icons: Record<string, JSX.Element> = {
    form: <FileText className={`${iconClasses} text-[#3B82F6]`} />,
    upload: <Upload className={`${iconClasses} text-[#8B5CF6]`} />,
    evaluation: <BarChart3 className={`${iconClasses} text-[#F97316]`} />,
    checkbox: <CheckSquare className={`${iconClasses} text-[#22C55E]`} />,
    email: <Mail className={`${iconClasses} text-[#6366F1]`} />,
    'table-form': <Users className={`${iconClasses} text-[#14B8A6]`} />
  };
  return icons[type] || <FileText className={`${iconClasses} text-[#6B7280]`} />;
};

interface TacheCardProps {
  tache: TacheThemeFormation;
  typeTaches: TypeTache[];
  lang: string;
  onExecute: (tache: TacheThemeFormation) => void;
  // Ajout de la prop pour gérer l'ouverture du chat
  onOpenChat: (tache: TacheThemeFormation) => void;
}

const TacheCard: React.FC<TacheCardProps> = ({ 
  tache, 
  typeTaches, 
  lang, 
  onExecute,
  onOpenChat
}) => {
  const { t } = useTranslation();
  const statut = tache.estExecutee ? ETAT_TACHE.EXECUTEE : ETAT_TACHE.NON_EXECUTEE;
  const type = typeTaches.find(tt => tt.key === tache.tache.type);

  const getStatusBadge = () => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-medium transition-colors";
    
    if (tache.estExecutee) {
      return (
        <span className={`${baseClasses} bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]`}>
          {t('label.terminee')}
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]`}>
          {t('label.a_faire')}
        </span>
      );
    }
  };
  
  // Fonction pour gérer l'ouverture du chat
  const handleOpenChat = () => {
    onOpenChat(tache);
  };

  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:border-[#D1D5DB] transition-all duration-200 hover:-translate-y-0.5">
      {/* Header avec status et type */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <StatusIcon statut={lang === 'fr' ? statut.nomFr : statut.nomEn} />
            <TacheTypeIcon type={tache.tache.type||""} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#111827] text-sm md:text-base line-clamp-2">
              {lang === 'fr' ? tache.tache.nomFr : tache.tache.nomEn}
            </h3>
            {type && (
              <p className="text-xs text-[#6B7280] mt-1">
                {lang === 'fr' ? type.nomFr : type.nomEn}
              </p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Informations complémentaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
        {tache.responsable?.nom && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
            <span className="text-[#4B5563] truncate">{tache.responsable.nom}</span>
          </div>
        )}
        {tache.dateFin && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
            <span className="text-[#4B5563]">{tache.dateFin}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!tache.estExecutee && (
        <div className="pt-4 border-t border-[#F3F4F6] flex flex-wrap gap-2">
          <button
            onClick={() => onExecute(tache)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-2"
          >
            {t('label.executer')}
          </button>
          <button
            onClick={handleOpenChat}
            className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#4B5563] text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} />
            {t('label.chat')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TacheCard;