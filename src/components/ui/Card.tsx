import React from 'react';
import { BarChart3, CheckCircle } from 'lucide-react'; // Icônes (via lucide-react)
import Skeleton from 'react-loading-skeleton';

interface CardStatProps {
  title: string;
  value: string | number | null;
  icon?: React.ReactNode;
  color?: string; // ex: 'bg-blue-100 text-blue-600'
  footer?: React.ReactNode;
  isLoading?:boolean
}

export const CardStat = ({ title, value, icon, color = '', footer, isLoading }: CardStatProps) => {
  return (
    isLoading?<Skeleton count={3}/>:(<div className="bg-white dark:bg-boxdark rounded-2xl p-5 shadow-sm border hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>)
  );
};
