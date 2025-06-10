import LanguageToogle from "../../components/ui/language_toggle";
import LeftSectionAuth from "./componants/LeftSectionAuth";
import MobileHead from "./componants/MobileHead";
import RightSectionResetPassword from "./componants/RightResetPassword";


const ResetPassword = () => {

    return (
        <>
            <div className='flex bg-white h-screen'>
                {/* gauche */}
                <div className='hidden lg:block bg-black w-1/2'>
                    <LeftSectionAuth />
                </div>


                {/* uniquement sur mobile : haut */}


                <div className='bg-white h-screen w-full lg:w-1/2 overflow-auto'>
                    {/* uniquement sur mobile : haut */}
                    <div className="mt-8 mb-10">
                        <LanguageToogle />
                    </div>

                    <MobileHead />
                    <RightSectionResetPassword />
                </div>
            </div >
        </>
    );
};

export default ResetPassword;
