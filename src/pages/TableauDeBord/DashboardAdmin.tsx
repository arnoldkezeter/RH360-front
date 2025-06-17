import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { useEffect } from "react";
import { useHeader } from "../../components/Context/HeaderConfig";

const DashBoardAmin = () => {
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    
    const { setHeaderConfig } = useHeader();
    
    useEffect(() => {
        setHeaderConfig({
        title: undefined,
        showAddButton: false,
        exportOptions: [],
        importOptions: [],
        });
    }, []);

    return (
        <>
            
        </>
    );
};

export default DashBoardAmin;
