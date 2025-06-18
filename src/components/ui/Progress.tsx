interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-strokedark rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-green-500 h-full transition-all duration-700"
        style={{ width: `72%` }}
      ></div>
    </div>
  );
};
