interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="w-full bg-[#E5E7EB] dark:bg-strokedark rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-[#10B981] h-full transition-all duration-700"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};
