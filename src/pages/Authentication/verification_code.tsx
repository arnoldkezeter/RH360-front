import LanguageToogle from "../../components/ui/language_toggle";
import LeftSectionAuth from "./componants/LeftSectionAuth";
import MobileHead from "./componants/MobileHead";
import { RightSectionVerificationCode } from "./componants/RightSectionVerificationCode";

const VerificationCode = () => {

    return (
        <>
            <div className='flex flex-col lg:flex-row bg-white h-screen'>
                {/* gauche */}
                <div className='hidden lg:block bg-black w-1/2'>
                    <LeftSectionAuth />
                </div>




                <div className='bg-white h-screen w-full lg:w-1/2 overflow-auto'>
                    {/* uniquement sur mobile : haut */}
                    <div className="mt-8 mb-10">
                        <LanguageToogle />
                    </div>

                    <MobileHead />
                    <RightSectionVerificationCode />
                </div>
            </div >
        </>
    );
};

export default VerificationCode;
