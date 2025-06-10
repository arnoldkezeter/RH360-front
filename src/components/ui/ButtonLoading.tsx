import { useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';

interface ButtonLoadingProps {
    handle: () => void;
    title: string;
    loading: boolean;
}

const ButtonLoading = ({ handle, title, loading }: ButtonLoadingProps) => {
    const lang = useSelector((state: RootState) => state.setting.language);
    return (
        <button
            className={`${loading && 'opacity-50'} min-w-[180px] flex justify-center rounded bg-primary py-2 px-4 lg:px-10 font-medium text-gray hover:bg-opacity-70 text-[12px] lg:text-sm`}
            onClick={loading ? () => { alert('Patientez la fin du chargement !') } : handle}
        >
            {loading && (
                <div className="flex items-center justify-center bg-transparent pr-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                </div>
            )}
            {loading ? <p>{lang === 'en' ? 'Loading' : 'Chargement'}...</p> : title}
        </button>
    );
};

export default ButtonLoading;
