import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ExecutionRateCard = ({
  isProgramme=true,
  pourcentageExecution,
  lang = 'fr',
}: {
  isProgramme?:boolean
  pourcentageExecution: ExecutionRateResult;
  lang: string;
}) => {
  const {t}=useTranslation()
  const average =
    pourcentageExecution.details.length > 0
      ? Math.round(
          pourcentageExecution.details.reduce((sum, t) => sum + t.tauxExecution, 0) /
            pourcentageExecution.details.length
        )
      : 0;

  return (
    <div className="bg-[#ffffff] dark:bg-[#1f2937] rounded-2xl shadow-lg border border-[#e5e7eb] dark:border-[#374151] p-4">
      {/* Header compact */}
      <div className="bg-gradient-to-r from-[#2563eb] to-[#4f46e5] p-2 rounded-md mb-4 text-white flex items-center gap-2">
        <div className="p-1 bg-white/20 rounded-md">
          <Target className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold">
          {t('label.taux_execution_global')}
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Cercle de progression (à gauche) */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56">
            <CircularProgressbar
              value={pourcentageExecution.tauxExecutionGlobal}
              text={`${pourcentageExecution.tauxExecutionGlobal}%`}
              styles={buildStyles({
                textColor: "#1f2937",
                pathColor: "#3b82f6",
                trailColor: "#f3f4f6",
                textSize: "16px",
                pathTransitionDuration: 1.5,
              })}
            />
            <div className="absolute -top-2 -right-2 bg-[#10b981] text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {pourcentageExecution.tauxExecutionGlobal > 80
                ? t('label.excellent')
                : pourcentageExecution.tauxExecutionGlobal > 60
                ? t('label.bon')
                : t('label.a_ameliorer')}
            </div>
          </div>
        </div>

        {/* Barres de progression (à droite) */}
        <div className="w-full lg:w-2/3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-[#4b5563] dark:text-[#9ca3af]" />
            <h4 className="text-base font-semibold text-[#111827] dark:text-[#e5e7eb]">
              {isProgramme?t('label.detail_par_axe'):t('label.detail_par_theme')}
            </h4>
          </div>

          <div className="space-y-3">
            {pourcentageExecution.details.map((item, index) => (
              <div
                key={index}
                className="p-2 rounded-md bg-[#f9fafb] dark:bg-[#374151] hover:bg-[#f3f4f6] dark:hover:bg-[#4b5563] transition"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm truncate text-[#111827] dark:text-[#e5e7eb] pr-2">
                    {lang==='fr'?item.titreFr:item.titreEn}
                  </span>
                  <span className="text-sm font-bold text-[#2563eb] dark:text-[#60a5fa]">
                    {item.tauxExecution}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#e5e7eb] dark:bg-[#6b7280] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
                    style={{ width: `${item.tauxExecution}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats en bas */}
      <div className="mt-6 pt-4 border-t border-[#e5e7eb] dark:border-[#4b5563]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-[#eff6ff] dark:bg-[#1e3a8a] rounded-md">
            <div className="text-xl font-bold text-[#2563eb] dark:text-[#93c5fd]">
              {pourcentageExecution.details.length}
            </div>
            <div className="text-sm text-[#6b7280] dark:text-[#d1d5db]">
              {isProgramme?t('label.axes_strategique'):t('label.themes')}
            </div>
          </div>
          <div className="p-2 bg-[#ecfdf5] dark:bg-[#064e3b] rounded-md">
            <div className="text-xl font-bold text-[#059669] dark:text-[#6ee7b7]">
              {
                pourcentageExecution.details.filter((t) => t.tauxExecution >= 80).length
              }
            </div>
            <div className="text-sm text-[#6b7280] dark:text-[#d1d5db]">
              {t('label.excellent')}
            </div>
          </div>
          <div className="p-2 bg-[#fff7ed] dark:bg-[#7c2d12] rounded-md col-span-2 sm:col-span-1">
            <div className="text-xl font-bold text-[#ea580c] dark:text-[#fdba74]">
              {average}%
            </div>
            <div className="text-sm text-[#6b7280] dark:text-[#f3f4f6]">
              {t('label.moyenne')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionRateCard;
