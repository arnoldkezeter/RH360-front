interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div className="w-full bg-[#E5E7EB] dark:bg-strokedark rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-[#6B7280] h-full transition-all duration-700"
        style={{ width: `72%` }}
      ></div>
    </div>
  );
};
