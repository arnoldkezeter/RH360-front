import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../_redux/store";

const DashBoardAmin = () => {
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    
    return (
        <>
            
        </>
    );
};

export default DashBoardAmin;
