import LanguageToogle from "../../components/ui/language_toggle";
import LeftSectionAuth from "./componants/LeftSectionAuth";
import MobileHead from "./componants/MobileHead";
import RightSectionSigin from "./componants/RightSectionSignin";


const SignIn = () => {

  return (
    <>
      <div className='flex bg-white h-screen'>
          {/* gauche */}
          <div className='hidden lg:block bg-[#1f6de8] w-1/2'>
            <LeftSectionAuth />
          </div>


          {/* uniquement sur mobile : haut */}


          {/* Droite */}
          <div className='bg-white h-screen w-full lg:w-1/2 overflow-auto'>
            {/* uniquement sur mobile : haut */}
            <div className="mt-8 mb-10">
              <LanguageToogle />
            </div>

            <MobileHead />
            <RightSectionSigin />
        </div>
      </div>
    </>
  );
};

export default SignIn;