import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  onDateChange?: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  
  placeholder?: { fr: string; en: string };
  language?: "fr" | "en";
}

const translations = {
  fr: {
    placeholder: "Sélectionner une période",
    cancel: "Annuler",
    confirm: "Valider",
    months: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ],
    days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  },
  en: {
    placeholder: "Select a date range",
    cancel: "Cancel",
    confirm: "Confirm",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

export interface DateRangePickerHandle {
  reset: () => void;
}

const DateRangePicker = forwardRef<DateRangePickerHandle, DateRangePickerProps>(({
  onDateChange,
  initialStartDate = null,
  initialEndDate = null,
  placeholder = translations.fr.placeholder,
  language = "fr",
}, ref) => {

  useImperativeHandle(ref, () => ({
  reset: () => {
    setStartDate(null);
    setEndDate(null);
    setSelectingStart(true);
    if (onDateChange) onDateChange(null, null);
  },
}));

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const lang = translations[language];

  // Fermer le calendrier quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDisplayText = () => {
    if (!startDate && !endDate) return lang.placeholder;
    if (startDate && !endDate) return `${formatDate(startDate)} - `;
    if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    return lang.placeholder;
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isRangeEnd = (date: Date) => {
    return (
      (startDate && date.getTime() === startDate.getTime()) ||
      (endDate && date.getTime() === endDate.getTime())
    );
  };

const handleDateClick = (date: Date) => {
    if (selectingStart || !startDate) {
        // Premier clic : définir la date de début
        setStartDate(date);
        setEndDate(null);
        setSelectingStart(false);
    } else {
        // Deuxième clic : définir la date de fin
        let finalStart: Date;
        let finalEnd: Date;
        
        if (date < startDate) {
            // Si la nouvelle date est antérieure, inverser les dates
            finalStart = date;
            finalEnd = startDate;
        } else {
            // Si la nouvelle date est postérieure, ordre normal
            finalStart = startDate;
            finalEnd = date;
        }
        
        // Mettre à jour les états avec les valeurs finales
        setStartDate(finalStart);
        setEndDate(finalEnd);
        setSelectingStart(true);
        
        // Auto-fermeture et appel onDateChange avec les valeurs calculées
        
        setIsOpen(false);
        if (onDateChange) {
            onDateChange(finalStart, finalEnd);
        }
    }
};

  const handleValidate = () => {
    if (startDate && endDate) {
      setIsOpen(false);
      setSelectingStart(true);
      if (onDateChange) {
        onDateChange(startDate, endDate);
      }
    }
  };

  const handleCancel = () => {
    setStartDate(null);
    setEndDate(null);
    setIsOpen(false);
    setSelectingStart(true);
    if (onDateChange) {
      onDateChange(null, null);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-3.5 border border-stroke rounded cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 bg-white text-xs"
      >
        <span
          className={`flex-1 ${!startDate && !endDate ? "text-gray-500" : "text-gray-900"} truncate`}
        >
          {getDisplayText()}
        </span>
        <Calendar className="w-3 h-3 text-gray-400 ml-1 flex-shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-200 rounded shadow-lg z-50 w-52">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={goToPreviousMonth}
              className="p-0.5 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <h2 className="text-[10px] font-medium">
              {lang.months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-0.5 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-0.5">
            {lang.days.map(day => (
              <div key={day} className="text-center text-[8px] font-medium text-gray-500 py-0.5">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div key={index} className="w-5 h-5">
                {date && (
                  <button
                    onClick={() => handleDateClick(date)}
                    className={`w-full h-full text-[8px] rounded transition-colors flex items-center justify-center ${
                      isRangeEnd(date)
                        ? "bg-blue-500 text-white"
                        : isInRange(date)
                        ? "bg-blue-100 text-blue-900"
                        : "hover:bg-gray-100 text-gray-900"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-1 pt-0.5 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-1.5 py-0.5 text-[8px] text-gray-600 hover:text-gray-800 transition-colors"
            >
              {lang.cancel}
            </button>
            <button
              onClick={handleValidate}
              disabled={!startDate || !endDate}
              className={`px-1.5 py-0.5 text-[8px] rounded transition-colors ${
                startDate && endDate
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {lang.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default DateRangePicker;
