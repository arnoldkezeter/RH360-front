

import { CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";



interface CardSectionTacheStagiaireProps {
    stats:any;
    progressionPercent:number
   
}

const CardSection = ({ stats, progressionPercent}: CardSectionTacheStagiaireProps) => {
   const {t}=useTranslation()
    return (
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6  mt-3">
          <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-xs sm:text-sm font-medium">{t('label.taches_completees')}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats?.totalCompletees || 0}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">{t('label.taches_en_cours')}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{(stats?.totalTaches || 0) - (stats?.totalCompletees || 0)}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#EF4444] to-[#DC2626] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs sm:text-sm font-medium">{t('label.jour_absence')}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats?.totalAbsences || 0}</p>
              </div>
              <XCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">{t('label.progression')}</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{progressionPercent}%</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-200" />
            </div>
          </div>
        </div>
    );
};


export default CardSection;