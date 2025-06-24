import React from 'react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';

interface GanttGridProps {
  formations: Formation[];
  lang: string;
}

const GanttChart: React.FC<GanttGridProps> = ({ formations, lang }) => {
  const language = lang === 'fr' ? 'Fr' : 'En';
  const months = Array.from({ length: 12 }, (_, i) => i);

  const calculateProgress = (done: number, total: number): number => {
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderMonthlyProgress = (
    start: string,
    end: string,
    progress: number,
    label: string
  ) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const year = startDate.getFullYear();

    return months.map((monthIndex) => {
      const monthStart = new Date(year, monthIndex, 1);
      const daysInMonth = getDaysInMonth(monthIndex, year);
      const monthEnd = new Date(year, monthIndex, daysInMonth);

      if (endDate < monthStart || startDate > monthEnd) {
        return (
          <td key={monthIndex} className="relative w-40 h-14 border border-stroke bg-white" />
        );
      }

      const effectiveStart = startDate > monthStart ? startDate : monthStart;
      const effectiveEnd = endDate < monthEnd ? endDate : monthEnd;

      const startDay = effectiveStart.getDate();
      const endDay = effectiveEnd.getDate();
      const range = endDay - startDay + 1;
      const widthPercent = (range / daysInMonth) * 100;
      const leftPercent = (startDay / daysInMonth) * 100;

      const tooltip = `${progress}% – ${format(startDate, 'dd MMM yyyy', { locale: fr })} → ${format(endDate, 'dd MMM yyyy', { locale: fr })}`;

      return (
        <td key={monthIndex} className="relative w-40 h-14 border border-stroke bg-white">
          <div
            className="absolute top-1/2 translate-y-[-50%] h-3 rounded-md bg-[#2563EB] bg-opacity-30 hover:opacity-90 transition-all duration-300 overflow-hidden cursor-pointer"
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
              height: '0.75rem',
            }}
            title={tooltip}
          >
            <div
              className="h-full rounded-md bg-[#1D4ED8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </td>
      );
    });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-stroke">
      <table className="min-w-max table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-700 text-left">
            <th className="sticky left-0 z-10 bg-white px-4 py-3 w-72 border-r border-stroke font-semibold">
               Formation / Thème
            </th>
            {months.map((m) => (
              <th
                key={m}
                className="w-40 min-w-40 text-center px-2 py-3 border-b border-stroke"
              >
                {format(new Date(2025, m, 1), 'MMM', { locale: fr })}
                <div className="text-xs text-gray-400">
                  {getDaysInMonth(m, 2025)} jrs
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {formations.map((formation) => (
            <React.Fragment key={formation._id}>
              <tr className="border-t border-stroke">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 font-medium text-gray-800 border-r border-stroke">
                  {formation[`titre${language}`]}
                  <div className="text-xs text-[#2563EB]">
                    {formation.axeStrategique[`nom${language}`]}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formation.nbTachesExecutees}/{formation.nbTachesTotal} tâches
                  </div>
                </td>
                {renderMonthlyProgress(
                  formation.dateDebut || "",
                  formation.dateFin || "",
                  calculateProgress(formation.nbTachesExecutees || 0, formation.nbTachesTotal || 0),
                  formation[`titre${language}`]
                )}
              </tr>
              {formation.themes.map((theme) => (
                <tr key={theme._id} className="border-t border-stroke">
                  <td className="sticky left-0 z-10 bg-white px-6 py-3 text-gray-600 border-r border-stroke">
                    {theme[`titre${language}`]}
                    <div className="text-xs text-gray-400 mt-1">
                      {theme.nbTachesExecutees}/{theme.nbTachesTotal} tâches
                    </div>
                  </td>
                  {renderMonthlyProgress(
                    theme.dateDebut,
                    theme.dateFin,
                    calculateProgress(theme.nbTachesExecutees || 0, theme.nbTachesTotal || 0),
                    theme[`titre${language}`]
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GanttChart;
