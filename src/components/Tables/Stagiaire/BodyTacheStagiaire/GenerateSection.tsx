

import { ChevronDown, Download } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";



interface GenerateSectionTacheStagiaireProps {
    dateDebut:Date|null; 
    dateFin:Date|null
}


const GenerateSection = ({ dateDebut, dateFin}: GenerateSectionTacheStagiaireProps) => {
    const [selectedFormat, setSelectedFormat] = useState('Format');
    const {t}=useTranslation();
    const handleDateChange = () => {
        console.log(dateDebut)
        console.log(dateFin)
    };
    return (
        <div className="bg-white shadow-sm border border-stroke mt-3 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Download className="w-6 h-6 text-[#4F63D2] mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">{t('label.generation_carnet')}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-gray-50 border-0 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-[#4F63D2] focus:bg-white transition-all"
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                >
                  <option>Format</option>
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>Word</option>
                </select>
                <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400" />
              </div>
              
              {/* <div className="sm:col-span-2">
                <button className="w-full bg-gradient-to-r from-[#4F63D2] to-[#6366F1] text-white px-6 py-3 rounded-xl hover:from-[#3B4CB8] hover:to-[#4F63D2] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Télécharger le rapport
                </button>
              </div> */}
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="text-sm font-semibold text-gray-900 mb-4">{t('label.inclure_rapport')}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{t('label.liste_tache')}</span>
                </label>
                <label className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{t('label.taux_absence')}</span>
                </label>
                <label className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-4 h-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">{t('label.obsevation_superviseur')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
    );
};


export default GenerateSection;