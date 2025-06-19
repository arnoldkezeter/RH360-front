import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NoData = ({
  message,
}: {
  message?: string;
}) => {
  const {t} = useTranslation()
  return (
    <div className="mb-30 flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
      <AlertTriangle className="w-10 h-10 text-yellow-500 mb-3" />
      <p className="text-lg font-medium">{message?message:t('label.aucune_donnee')}</p>
    </div>
  );
};
