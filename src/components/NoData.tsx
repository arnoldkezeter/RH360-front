import { AlertTriangle } from 'lucide-react';

export const NoData = ({
  message = "Aucune donnée disponible pour le moment.",
}: {
  message?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
      <AlertTriangle className="w-10 h-10 text-yellow-500 mb-3" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};
