import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Breadcrumb";
import { RootState } from "../../_redux/store";
import { config } from "../../config";


const Matieres = () => {
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;

    return (
        <>
            <Breadcrumb pageName={`Matières ${roles.teacher === userRole ? "de l'enseignant" : roles.student === userRole ? "" : ""}`} />

        </>
    );
};

export default Matieres;
