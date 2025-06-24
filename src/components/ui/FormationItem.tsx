import React from "react";
import { format, parseISO } from "date-fns";



const FormationItem = ({ formation }: { formation: Formation }) => {
  const calculatePercentage = (executed: number | null, total: number | null) =>
    total && total > 0 ? ((executed || 0) / total) * 100 : 0;

  const formatDate = (date: string | null) =>
    date ? format(parseISO(date), "dd/MM/yyyy") : "N/A";

  const getMonthAndDay = (date: string | null) => {
    if (!date) return null;
    const parsedDate = parseISO(date);
    const month = parsedDate.getMonth(); // 0 = Janvier, 11 = Décembre
    const day = parsedDate.getDate(); // Jour du mois
    return { month, day };
  };

  const calculateGridSpan = (
    start: string | null,
    end: string | null,
    daysInMonths: number[]
  ) => {
    if (!start || !end) return { start: 1, span: 1 };

    const startDate = getMonthAndDay(start);
    const endDate = getMonthAndDay(end);

    if (!startDate || !endDate) return { start: 1, span: 1 };

    const { month: startMonth, day: startDay } = startDate;
    const { month: endMonth, day: endDay } = endDate;

    // Calculer la position de début (colonne de grille)
    const startGridPos =
      daysInMonths.slice(0, startMonth).reduce((sum, days) => sum + days, 0) +
      startDay;

    // Calculer la position de fin (colonne de grille)
    const endGridPos =
      daysInMonths.slice(0, endMonth).reduce((sum, days) => sum + days, 0) +
      endDay;

    return { start: startGridPos, span: endGridPos - startGridPos + 1 };
  };

  // Nombre de jours dans chaque mois
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return (
    <div className="border rounded-lg p-4 shadow space-y-4">
      {/* En-tête Formation */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold">{formation.titreFr || "Titre non disponible"}</h2>
          <h3 className="text-sm text-gray-600">
            {formation.axeStrategique?.nomFr || "Axe stratégique non défini"}
          </h3>
        </div>
        <div className="text-right text-xs">
          <p className="text-gray-500">
            {`Période: ${formatDate(formation.dateDebut || "")} - ${formatDate(formation.dateFin || "")}`}
          </p>
          <p>
            {`Progression : ${formation.nbTachesExecutees || 0} / ${
              formation.nbTachesTotal || 0
            } (${Math.round(
              calculatePercentage(formation.nbTachesExecutees || 0, formation.nbTachesTotal || 0)
            )}%)`}
          </p>
        </div>
      </div>

      {/* Calendrier */}
      <div className="mt-6">
        {/* En-tête des mois */}
        <div className="grid grid-cols-365 text-xs text-center font-semibold mb-2">
          {daysInMonths.map((days, index) => (
            <div
              key={index}
              className="col-span-{days} border-r border-gray-300"
            >{`${
              new Date(0, index).toLocaleString("default", { month: "short" }) // Jan, Feb, ...
            }`}</div>
          ))}
        </div>

        {/* Barres de progression de la formation */}
        <div className="relative grid grid-cols-365 gap-0.5">
          {/* Ligne de la formation */}
          <div
            className="absolute bg-blue-500 rounded-full h-4"
            style={{
              gridColumnStart: calculateGridSpan(
                formation.dateDebut || "",
                formation.dateFin || "",
                daysInMonths
              ).start,
              gridColumnEnd: `span ${calculateGridSpan(
                formation.dateDebut || "",
                formation.dateFin || "",
                daysInMonths
              ).span}`,
            }}
          ></div>

          {/* Lignes des thèmes */}
          {formation.themes.map((theme) => (
            <div
              key={theme._id}
              className="absolute bg-green-500 rounded-full h-4 mt-4"
              style={{
                gridColumnStart: calculateGridSpan(
                  theme.dateDebut,
                  theme.dateFin,
                  daysInMonths
                ).start,
                gridColumnEnd: `span ${calculateGridSpan(
                  theme.dateDebut,
                  theme.dateFin,
                  daysInMonths
                ).span}`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormationItem;
